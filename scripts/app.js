"use strict";

(function(app){
    app.portfolioItems = [];
    app.selectedItem = {};

    app.homePage = async function(){
        setCopyrightDate();
        await loadPageData();
        wireContactForm();
    };

    app.portfolioItem = async function(){
        setCopyrightDate();
        await loadPageData();
        loadSpecificItem();
        updateItemPage();
    };

    function setCopyrightDate(){
        const date = new Date();
        var e = document.getElementById('copyrightYear');
        e.innerText = date.getFullYear();
    }

    function wireContactForm(){
        var e = document.getElementById('contact-form');
        e.onsubmit = contactFormSubmit;
    }

    function contactFormSubmit(e){
        e.preventDefault();
        const form = document.getElementById('contact-form');
        const name = form.querySelector("#name");
        const email = form.querySelector("#email");
        const message = form.querySelector("#message");

        const mailTo = `mailto:${email.value}?subject=Contact From ${name.value}&body=${message.value}`
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
        app.selectedItem.id = item;
    }

    function updateItemPage(){
        const header = document.getElementById('work-item-header');
        const image = document.getElementById('work-item-image');
        const projectText = document.querySelector('#project-text p');
        const techSection = document.getElementById('technologies-text');
        const initProjectTech = document.querySelector('#technologies-text ul');
        const projectCha = document.querySelector('#challenges-text p');

        header.innerText = `0${app.selectedItem.id}. ${app.selectedItem.title}`
        image.src = app.selectedItem.largeImage;
        image.alt = app.selectedItem.largeImageAlt;
        projectText.innerText = app.selectedItem.projectText;
        projectCha.innerText = app.selectedItem.challengesText;

        const finalProjectTech = document.createElement("ul");
        for (let i = 0; i < app.selectedItem.technologies.length; i++) {
            const item = document.createElement("li");
            item.innerText = app.selectedItem.technologies[i];
            finalProjectTech.appendChild(item);
        }

        initProjectTech.remove();
        techSection.appendChild(finalProjectTech);
    }
})(window.app = window.app || {})
