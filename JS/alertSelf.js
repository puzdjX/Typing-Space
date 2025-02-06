
export function alertShow(message = "操作成功") {
    let alertSelf = document.querySelector('.alert')
    alertSelf.innerHTML = `
                        ${message}
                        <svg width="50" height="50" viewBox="0 0 400 400">
                            <polyline fill="none" stroke="#8BD17C" stroke-width="24" points="88,214 173,284 304,138"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    `
    alertSelf.classList.add('alert-show')
    setTimeout(() => {
        alertSelf.classList.remove('alert-show')
    }, 1500)
}
