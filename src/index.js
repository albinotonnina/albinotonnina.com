import {debounce} from 'throttle-debounce';
import {waitForWebfonts} from './scripts/utilities';
import Site from './scripts/Site';

document.querySelector('[rel="stylesheet"]').setAttribute('data-skrollr-stylesheet',true);

const onLoad = () => {

    // if (Modernizr.inlinesvg || Modernizr.svgclippaths) {

        const SiteInstance = new Site();

        window.onresize =  debounce(100, false, SiteInstance.resize.bind(SiteInstance));

        window.onbeforeprint = SiteInstance.destroy.bind(SiteInstance);

        if (window.matchMedia) {
            const mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(mql => {
                if (mql.matches) {
                    SiteInstance.beforePrint();
                }
            });
        }

        document.querySelector('#reopen').addEventListener('click', ev => {
            SiteInstance.show();
            ev.preventDefault();
        });
    // }

};

window.onload = waitForWebfonts(['Roboto:400,100,300,700,900'], onLoad);