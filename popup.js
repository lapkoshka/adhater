const form = document.querySelector('.checkboxes');

document.addEventListener('DOMContentLoaded', evt => {
  const state = localStorage.getItem('disabled');
  if (state === 'true') {
    form[0].checked = false;
    form[1].checked = true;
  }
  
});

form.addEventListener('change', evt => {
  const state = evt.target.id;
  if (state === 'radio-hide') {
    localStorage.removeItem('disabled')
  } else {
    localStorage.setItem('disabled', 'true')
  }
});