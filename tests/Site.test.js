import Site from '../src/scripts/Site';

jest.mock('animejs', () => (jest.fn));

describe('Site', () => {

    let site;

    beforeAll(() => {
        document.body.innerHTML = `
            <div id="vignette"></div>
            <div id="reopen"></div>
            <div id="loader"></div>
        `;

        jest.mock('skrollr', () => ({
            init: jest.fn,
            refresh: jest.fn,
            addEvent: jest.fn,
            get: () => false
        }));

        site = new Site();
    });

    it('init skrollr', () => {

        expect(site.skrollr).toBeTruthy();
    });

    it('hide loader', () => {

        expect(document.querySelector('#loader').getAttribute('uiState')).toEqual('hidden');
    });

});