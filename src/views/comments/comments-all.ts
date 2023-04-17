import { Comment } from "../../news/comments/comments.service";

export function renderCommentsAll(comments: Comment[]): string {
    let commentsListHtml = ''
    if (comments) {
        for (const commentItem of comments) {
            commentsListHtml += renderCommentBlock(commentItem)
        }
    }
    return `
        <div class="card ml-3">
            <div class="card-header">
                Комментарии
            </div>
            ${commentsListHtml}
        </div>   
    `
}

function renderCommentBlock(comment: Comment): string {

    let answerListHtml = ''
    if (comment.reply) {
        for (const answerItem of comment.reply) {
            answerListHtml += renderAnswerBlock(answerItem)
        }
    }

    return `
    <div class="card-body clearfix border border-info">
      <blockquote class="blockquote mb-0">
        <p class='mb-0'>${comment.message}</p>
        <footer class="blockquote-footer">${comment.author}</footer>
      </blockquote>
      <button type="button" class="btn btn-info float-right h-50 p-1 w-50">Ответить</button>
        ${answerListHtml !== ''
            ? `<div class="card mt-5 w-100 ">
                    <div class="card-header p-1">
                        Ответы
                    </div>
                    ${answerListHtml}
                </div> `
            : ''
        }
    </div>
`
}

function renderAnswerBlock(reply: Comment): string {
    return `
    <div class="card-body clearfix border-bottom border-warning">
    <blockquote class="blockquote mb-0">
      <p class='mb-0'>${reply.message}</p>
      <footer class="blockquote-footer">${reply.author}</footer>
    </blockquote>
    </div>
`
}
