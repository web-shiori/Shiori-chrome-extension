const view = `
<h4>hoge</h4>
`;

const content_list_view = document.getElementById("content-list-view");
if (content_list_view !== null) {
    content_list_view.innerHTML = view;
} else {
    alert(document.documentElement.innerHTML)
}
