const acc = document.querySelectorAll(".accordion-btn");

acc.forEach(button => {

button.addEventListener("click", () => {

const content = button.nextElementSibling;

if(content.style.display === "block"){
content.style.display = "none";
}
else{
content.style.display = "block";
}

});

// On load: if ?career=... is present, open corresponding accordion
window.addEventListener('DOMContentLoaded', () => {
	const params = new URLSearchParams(window.location.search);
	const career = params.get('career');
	if(career){
		const map = { cyber:0, developer:1, analyst:2, erp:3 };
		const idx = map[career];
		if(typeof idx !== 'undefined' && acc[idx]){
			const btn = acc[idx];
			const content = btn.nextElementSibling;
			content.style.display = 'block';
			btn.scrollIntoView({behavior:'smooth', block:'center'});
		}
	}
});

});