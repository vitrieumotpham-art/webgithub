// helpers/createTree.js
function createTree(arr, parentId = "") {
  const tree = [];
  arr.forEach((item) => {
    // Chuyển ObjectID về String để so sánh không bị lỗi
    const itemParentId = item.parent_id ? String(item.parent_id) : "";
    
    if (itemParentId === String(parentId)) {
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  return tree;
}

// PHẢI CÓ DÒNG NÀY: Export trực tiếp function
module.exports = createTree;