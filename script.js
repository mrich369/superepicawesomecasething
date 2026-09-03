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
			cloud:0, cyber:1, dba:2, netadmin:3, qa:4, developer:5, ux:6,
			bizanalytics:7, analyst:8, erp:9, itba:10, itconsult:11,
			mgmtconsult:12, program:13, pm:14, sysanalyst:15
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