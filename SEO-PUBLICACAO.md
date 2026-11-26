# SEO e publicação — Wabner Augusto

## Estado atual: PRÉVIA (não indexável)
Este pacote contém metadados específicos por página, capa de compartilhamento, favicon, JSON-LD básico e um bloqueio de indexação **intencional**. Ele não deve ser apontado ao Google Search Console como site definitivo.

## Gerar versão pública após escolher seu domínio

Com Python 3 e BeautifulSoup instalados, execute:

```bash
python publicar_seo.py --domain https://seudominio.com.br
```

O comando escreve a versão **publicacao/**, com URLs canônicas absolutas, Open Graph, dados estruturados e sitemap.xml. Não use URL de prévia para gerar a versão pública. Inspecione os cases e a confidencialidade de materiais antes de liberar o site.

## Checklist ao publicar

1. Registrar o domínio na HostGator. Apontar DNS para o provedor onde o site está hospedado (ex.: Vercel); comprar domínio na HostGator não significa hospedar o site nela.
2. Escolher uma URL principal (com ou sem www) e configurar redirecionamento 301 da alternativa.
3. Gerar os arquivos públicos com a URL exata escolhida. Implantar o conteúdo da pasta **publicacao/** na hospedagem.
4. Confirmar HTTPS válido, página inicial e quatro cases acessíveis com HTTP 200, CSS/imagens carregados, links internos funcionando.
5. Conferir que o ambiente de testes continua protegido e não indexável. `robots.txt` sozinho não impede acesso nem protege conteúdo confidencial.
6. Validar o HTML e testar o compartilhamento no WhatsApp e LinkedIn, incluindo imagem OG absoluta.
7. Adicionar a propriedade de domínio no Google Search Console (verificação via DNS) e enviar `https://SEU_DOMINIO/sitemap.xml`.
8. Monitorar indexação, desempenho mobile e Core Web Vitals. Instalar analytics somente depois da decisão sobre privacidade/consentimento e ferramenta de medição.
9. Revisar permissão de uso das interfaces, dados sensíveis e screenshots antes da publicação aberta.

## Estratégia de busca

- **Marca pessoal:** Wabner Augusto, Wabner Augusto Product Design, portfólio Wabner Augusto.
- **Competências:** Product Design Leader, liderança de UX, Design Strategy, Product Discovery, Service Design, Design de Produto B2B, CX, UX Research.
- **Prova de experiência:** case Itaú Orquestrador de Limite, Game de Limite PicPay, iFood Checkout & Waiting, Portal Financeiro iFood.
- **Localidade:** São Paulo, Brasil (apenas como contexto profissional, não como palavra repetida artificialmente).

As palavras-chave são um mapa editorial, não meta keywords (campo desconsiderado pelo Google). Evitar repetição artificial e promessas de ranking.

## Observações

- Foi mantido o conteúdo e visual da V13; este pacote adiciona metadados e arquivos técnicos.
- Os URLs canônicos só podem ser definidos após escolher o domínio.
- O objeto Person em JSON-LD não garante rich results.
- Não foi configurada coleta de dados, Google Analytics ou Search Console automaticamente.
