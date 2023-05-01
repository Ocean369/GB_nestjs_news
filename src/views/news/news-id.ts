// import { News } from "../../news/news.service";
// import { renderCommentsAll } from "../comments/comments-all";
// import { Comment } from "../../news/comments/comments.service";

// export function renderNewsPagewithComment(news: News, comments: Comment[]): string {
//     const commentsListHtml = renderCommentsAll(comments);
//     const newsHtml = renderNewsBlock(news);
//     return `
//     <div>${newsHtml}</div>
//     <div class='mt-3'>${commentsListHtml}</div>
//      `
// }

// function renderNewsBlock(news: News) {
//     return `    
//             <div class="card" style="width: 100%;">
//             ${news.cover
//             ? `<img class="card-img-top" style="height: 200px; object-fit: cover;" src="${news.cover}" alt="${news.title}">`
//             : ''} 
//                 <div class="card-body">
//                     <h5 class="card-title">${news.title}</h5>

//                     <p class="card-text">${news.description}</p>
//                 </div>
//             </div>
// `
// }