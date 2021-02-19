const puppeteer = require('puppeteer');
    (async () => {
        //Lancement d'un navigateur
        const browser = await puppeteer.launch({headless: false, defaultViewport: null});
    
        //Ouverture d'un nouvelle page
        const page = await browser.newPage();
    
        //Recherche du site via son URL
        await page.goto('https://www.google.fr/maps');

        //A decommenter quand la phase de dev est active
        await popup();
        
        //Clique sur le barre de recherche
        await page.click('#searchboxinput');
    
        //Attend 2 secondes
        await page.waitForTimeout(2000);
    
        //Rentre le nom de la ville dans la barre de recherche
        await page.evaluate(() => document.querySelector('#searchboxinput').value = "pont de claix");
    
        //Lance la recherche
        await page.click('#searchbox-directions');
    
        //Attend 1 seconde
        await page.waitForTimeout(1000);
    
        //Inversion du point de départ
        await page.click('#omnibox-directions > div > div.widget-directions-waypoints > div.widget-directions-right-overlay > button');   
    
        //Création d'un tableau contenant les différents sls
        var sls = ['sls fontaine', 'sls Grenoble Ouest','sls Grenoble Est', 'sls Saint Martin le vinoux', 'sls Saint Martin D\'heres', 'maison du département de grenoble'];

        //Création d'un tableau contenant le temps de trajet pour les différents SLS
        var travelTime = [];
    
        //Log début du calcul des itiniraire
        console.log('Calcul des itiniraire en cours...')
    
        //Ajoute la destination dans le champ de recherche
        for (let i = 0; i < sls.length; i++) {
            //Clique sur le champs "destination"
            await page.click('#sb_ifc52 > input');
            
            //Rentre le nom du sls
            await page.keyboard.type(sls[i]);

            //Lance la recherche
            await page.keyboard.press('Enter');
            
            //Sélectionne le moyen de transport "Tram/Bus"
            await page.click('#omnibox-directions > div > div.widget-directions-travel-mode-switcher-container > div > div > div.adjusted-to-decreased-spacing.directions-travel-mode-selector > div:nth-child(3) > button');
    
            //Attend 1 seonde et 5 centième
            await page.waitForTimeout(1500);

            //Prend un screenshot des trajets
            //await page.screenshot({path : `img/${sls[i]}.png`, clip: {x: 50, y:5, width:350, height:700}});

            //Récupérer la balise qui contient le temps
            const timeInM = await page.$eval('#section-directions-trip-0 > div > div:nth-child(2) > div.section-directions-trip-numbers > div', element => element.textContent);

            const time = timeInM.split('');

            console.log(time[0] + time[1]);
            
        }
    
        await browser.close();

        async function popup() {    
            //Attend que l'iframe (la fenêtre popup)
            await page.waitForSelector('iframe');
    
            //Identification de l'iframe
            const elementHandle = await page.$('iframe[src="//consent.google.com?uxe=4423402&continue=https%3A%2F%2Fwww.google.fr%2Fmaps&pc=m&origin=https%3A%2F%2Fwww.google.fr&if=1&gl=FR&hl=fr"]',);
    
            //Récupération du contenue de l'iframe
            const frame = await elementHandle.contentFrame();
            
            //Click sur le bouton "j'accepte"
            await frame.click('#introAgreeButton > span > span');
        };
    
})();