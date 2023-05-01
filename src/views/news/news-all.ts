import { News } from "../../news/news.service";

export function renderNewsAll(news: News[]) {
    let newsListHtml = ''
    for (const newsItem of news) {
        newsListHtml += renderNewsBlock(newsItem)
    }
    return `
        <h1> Список новостей </h1>
        <div class='row'>
            ${newsListHtml}
        </div>   
    `
}

function renderNewsBlock(news: News) {
    return `
        <div class ='col-lg-4 mb-2'>
            <div class="card" style="width: 100%;">
            ${news.cover
            ? `<img class="card-img-top" style="height: 200px; object-fit: cover;" src="${news.cover}" alt="${news.title}">`
            : ''} 
                <div class="card-body">
                    <h5 class="card-title">${news.title}</h5>
          
                    <p class="card-text">${news.description}</p>
                    <a href="http://localhost:3000/news/${news.id}/detail" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        </div>
`
}