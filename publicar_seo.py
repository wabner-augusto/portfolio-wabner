#!/usr/bin/env python3
"""Gera pacote indexável com domínio final. Necessita: pip install beautifulsoup4"""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import argparse, shutil, json
from xml.etree.ElementTree import Element, SubElement, ElementTree, indent

ROOT=Path(__file__).resolve().parent
PAGES=['index.html','projetos/orquestrador-de-limite.html','projetos/checkout-waiting.html','projetos/game-de-limite.html','projetos/portal-financeiro-ifood.html']

def add_meta(s,name,content,property_=False):
    attr={'property' if property_ else 'name':name}
    tag=s.head.find('meta',attrs=attr)
    if tag is None:
        tag=s.new_tag('meta',attrs=attr);s.head.append(tag)
    tag['content']=content

def main(domain):
    domain=domain.rstrip('/')
    parsed=urlparse(domain)
    if parsed.scheme!='https' or not parsed.netloc or parsed.path or parsed.query or parsed.fragment:
        raise ValueError('Informe o domínio final como https://seudominio.com.br, sem caminho ou barra final')
    if parsed.netloc.endswith('.vercel.app') or parsed.netloc.endswith('.framer.website'):
        raise ValueError('Use o domínio definitivo, não um endereço provisório de homologação')
    dest=ROOT/'publicacao'
    if dest.exists():shutil.rmtree(dest)
    dest.mkdir()
    for child in ROOT.iterdir():
        if child.name in ('publicacao','publicar_seo.py','SEO-PUBLICACAO.md'):
            continue
        if child.is_dir():shutil.copytree(child,dest/child.name)
        else:shutil.copy2(child,dest/child.name)
    for page in PAGES:
        f=dest/page
        s=BeautifulSoup(f.read_text(encoding='utf-8'),'html.parser')
        url=domain+'/' if page=='index.html' else domain+'/'+page
        add_meta(s,'robots','index, follow, max-image-preview:large')
        add_meta(s,'og:url',url,True)
        add_meta(s,'og:image',domain+'/assets/og-wabner.jpg',True)
        add_meta(s,'og:image:alt','Wabner Augusto — Design, Estratégia e Liderança',True)
        add_meta(s,'og:image:width','1200',True)
        add_meta(s,'og:image:height','630',True)
        add_meta(s,'twitter:image',domain+'/assets/og-wabner.jpg')
        canonical=s.head.find('link',rel='canonical')
        if canonical is None:
            canonical=s.new_tag('link',rel='canonical');s.head.append(canonical)
        canonical['href']=url
        for script in s.head.select('script[type="application/ld+json"]'):
            try:
                data=json.loads(script.string or '{}')
                if data.get('@type')=='Person':
                    data['url']=domain+'/'
                    data['image']=domain+'/assets/wabner-retrato.png'
                    script.string=json.dumps(data,ensure_ascii=False)
            except (ValueError,TypeError):
                pass
        if page=='index.html':
            data={'@context':'https://schema.org','@type':'WebSite','name':'Wabner Augusto','url':domain+'/','inLanguage':'pt-BR','description':s.head.find('meta',attrs={'name':'description'})['content']}
        else:
            data={'@context':'https://schema.org','@type':'WebPage','name':s.title.get_text(strip=True),'url':url,'inLanguage':'pt-BR','isPartOf':{'@type':'WebSite','name':'Wabner Augusto','url':domain+'/'},'about':{'@type':'Thing','name':s.h1.get_text(' ',strip=True) if s.h1 else s.title.get_text(strip=True)},'breadcrumb':{'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Início','item':domain+'/'},{'@type':'ListItem','position':2,'name':s.h1.get_text(' ',strip=True),'item':url}]}}
        script=s.new_tag('script',type='application/ld+json');script.string=json.dumps(data,ensure_ascii=False);s.head.append(script)
        f.write_text(str(s),encoding='utf-8')
    robots='User-agent: *\nAllow: /\nSitemap: '+domain+'/sitemap.xml\n'
    (dest/'robots.txt').write_text(robots,encoding='utf-8')
    root=Element('urlset',xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
    for page in PAGES:
        item=SubElement(root,'url');SubElement(item,'loc').text=domain+'/' if page=='index.html' else domain+'/'+page
    indent(root)
    ElementTree(root).write(dest/'sitemap.xml',encoding='utf-8',xml_declaration=True)
    print('Site público gerado em:',dest)
    print('Domínio principal:',domain)
    print('Sitemap:',domain+'/sitemap.xml')

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--domain',required=True,help='https://seudominio.com.br')
    args=parser.parse_args()
    main(args.domain)
