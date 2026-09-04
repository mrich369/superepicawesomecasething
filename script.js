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

});

const aiDisclosureButton = document.getElementById('aiDisclosureButton');
const aiDisclosureModal = document.getElementById('aiDisclosureModal');

if (aiDisclosureButton && aiDisclosureModal) {
	aiDisclosureButton.addEventListener('click', () => {
		aiDisclosureModal.classList.remove('hidden');
	});

	const aiDisclosureClose = aiDisclosureModal.querySelector('.close-btn');
	aiDisclosureClose?.addEventListener('click', () => {
		aiDisclosureModal.classList.add('hidden');
	});

	aiDisclosureModal.addEventListener('click', (event) => {
		if (event.target === aiDisclosureModal) {
			aiDisclosureModal.classList.add('hidden');
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			aiDisclosureModal.classList.add('hidden');
		}
	});
}

const sourcesButton = document.getElementById('sourcesButton');
const sourcesModal = document.getElementById('sourcesModal');

if (sourcesButton && sourcesModal) {
	sourcesButton.addEventListener('click', () => {
		sourcesModal.classList.remove('hidden');
	});

	const sourcesClose = sourcesModal.querySelector('.close-btn');
	sourcesClose?.addEventListener('click', () => {
		sourcesModal.classList.add('hidden');
	});

	sourcesModal.addEventListener('click', (event) => {
		if (event.target === sourcesModal) {
			sourcesModal.classList.add('hidden');
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			sourcesModal.classList.add('hidden');
		}
	});
}

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