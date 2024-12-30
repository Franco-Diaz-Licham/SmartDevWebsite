"use strict";

(function(app){
    app.portfolioItems = [];
    app.selectedItem = {};

    app.homePage = async function(){
        setCopyrightDate();
        wireContactForm();
        wireUpPage();
    };

    app.portfolioItem = async function(){
        setCopyrightDate();
        await loadPageData();
        loadSpecificItem();
        updateItemPage();
    };

    function wireUpPage(){
        const items = document.querySelectorAll('.card');

        items.forEach(item => {
            item.addEventListener('click', () => navigateToItem(item) )
        });
    }

    function navigateToItem(e){
        window.location.href = `/portfolioItem.html?item=${e.id}`;
    }

    function setCopyrightDate(){
        const date = new Date();
        var e = document.getElementById('copyrightYear');
        e.innerHTML = `&copy; ${date.getFullYear()} by Franco Diaz`;
    }

    function wireContactForm(){
        var e = document.getElementById('contact-form');
        e.onsubmit = contactFormSubmit;
    }

    function contactFormSubmit(e){
        e.preventDefault();
        const form = document.getElementById('contact-form');
        const name = form.querySelector("#name");
        const email = 'smartdevau@outlook.com';
        const message = form.querySelector("#message");

        const mailTo = `mailto:${email}?subject=Contact From ${name.value}&body=${message.value}`
        window.open(mailTo);

        name.value = '';
        email.value = '';
        message.value = '';
    }

    async function loadPageData(){
        const cacheData = sessionStorage.getItem('site-data');

        if(cacheData !== null){
            app.portfolioItems = JSON.parse(cacheData);
        } else{
            const rawData = await fetch('../sitedata.json')
            const data = await rawData.json();
            app.portfolioItems = data;
            sessionStorage.setItem('site-data', JSON.stringify(data));
        }
    }

    function loadSpecificItem(){
        const params = new URLSearchParams(window.location.search);
        let par = params.get('item');
        let item = Number.parseInt(par);

        if(item > app.portfolioItems.length || item < 1){
            item = 1;
        }

        app.selectedItem = app.portfolioItems[item - 1];
        console.log(app.selectedItem);
    }

    function updateItemPage(){
        const title = document.getElementById('title');
        const subtitle = document.getElementById('subtitle');
        const projectText = document.getElementById('projectText');
        const benefits = document.getElementById('benefitsList');

        title.innerHTML = `${app.selectedItem.title}`
        subtitle.innerText = `${app.selectedItem.subtitle}`
        projectText.innerText = `${app.selectedItem.projectText}`

        for (let i = 0; i < app.selectedItem.benefits.length; i++) {
            const item = document.createElement("li");
            item.innerText = app.selectedItem.benefits[i];
            benefits.appendChild(item);
        }

        const indicators = document.querySelector('#carouselExampleIndicators .carousel-indicators');
        for (let i = 0; i < app.selectedItem.projectPhotos.length; i++) {
            const button = document.createElement("button");
            button.type = 'button';
            button.setAttribute('data-bs-target', '#carouselExampleIndicators');
            button.setAttribute('data-bs-slide-to', i);
            button.setAttribute('aria-label', `Slide ${i + 1}`);

            const carousel = document.querySelector('#carouselExampleIndicators .carousel-inner');
            const imageDiv = document.createElement('div');
            const img = document.createElement('img');
            imageDiv.className = 'carousel-item';
            img.src = app.selectedItem.projectPhotos[i];
            img.className = 'd-block w-100';

            if(i === 0){
                button.className = 'active';
                button.setAttribute('aria-current', 'true');
                imageDiv.classList.add('active');
            }
            
            indicators.appendChild(button);
            imageDiv.appendChild(img);
            carousel.appendChild(imageDiv);
        }

    }
})(window.app = window.app || {})
