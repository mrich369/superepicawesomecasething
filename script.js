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
		const map = {
			cyber:0, developer:1, analyst:2, erp:3,
			cloud:4, dba:5, netadmin:6, qa:7, ux:8,
			bizanalytics:9, itconsult:10, itba:11,
			mgmtconsult:12, pm:13, program:14, sysanalyst:15
		};
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