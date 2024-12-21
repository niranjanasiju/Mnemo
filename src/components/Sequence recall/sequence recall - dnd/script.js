const draggables = document.querySelectorAll('.Draggable');
const containers = document.querySelectorAll('.container');


draggables.forEach(Draggable => {
  Draggable.addEventListener('dragstart', () => {
    Draggable.classList.add('dragging');
  });

  Draggable.addEventListener('dragend', () => {
    Draggable.classList.remove('dragging');
  });
});


containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const Draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(Draggable); 
    } else {
      container.insertBefore(Draggable, afterElement); 
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.Draggable:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
