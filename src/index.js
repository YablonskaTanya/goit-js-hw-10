import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(() => {
    const trimValue = refs.searchBox.value.trim();
    clearHtml();
    if (trimValue !== '') {
      fetchCountries(trimValue).then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (data.length >= 2 && data.length <= 10) {
          createCountryLabel(data);
        } else if (data.length === 1) {
          createCountryList(data);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

// function onValidateFormData(e) {}

function createCountryLabel(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-list__item">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="40" hight="30">
         <p>${country.name.official}</p>
                </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function createCountryList(countries) {
  const markup = countries
    .map(country => {
      return `

<ul>
  <li class="country-info__item">
  <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="40" hight="30">
    <h1>${country.name.official}
    </h1>
  </li>
  <li>
    <p class="subtitle">
      Capital: 
      <span>${country.capital}</span>
    </p>
  </li>
  <li>
    <p class="subtitle">
      Population: 
      <span>${country.population}</span>
    </p>
  </li>
  <li>
    <p class="subtitle">
      Languages: 
      <span>${Object.values(country.languages)}</span>
    </p>
  </li>
</ul>
`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function clearHtml() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
