class Show_error {
    constructor(error, where) {
        this.error = error;
        this.where = where;
    }

    show() {
        const all_messages_errors = document.querySelectorAll(`#${this.where} .alert_messages > *`);
        all_messages_errors.forEach(element => {
            element.style.display = "none";
        })

        const input_group = document.querySelector(`#${this.where}`);
        input_group.classList.add('error');

        const error = document.querySelector(`#${this.where} .${this.error}`);
        error.style.display = "block";
    }
}

class Siret {
    #__result;
    constructor(siret_number) {
        this.__siret_number = siret_number;
    }
    check_count_and_content() {
        return !!this.__siret_number.toString().match(/^[0-9]{14}$/);
    }

    check_luhn() {
        let total = this.__siret_number.toString().split('').reverse().map((nb, index) => {
            let number = parseInt(nb, 10);
            number = index % 2 === 0 ?  number : number * 2
            return number > 9 ? number - 9 : number;
        }).reduce((a, b) => a + b)
        return total % 10 === 0;
    }

    async search_company() {
        let request = await fetch(`https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${this.__siret_number}`)
        if (request.ok) {
            this.#__result = await request.json();
            return true;
        } else {
            return false;
        }
    }

    insert_in_form() {
        const res_form = [
            this.#__result.etablissement.unite_legale.sigle,            // name
            this.#__result.etablissement.geo_l4,                        // address
            this.#__result.etablissement.libelle_commune,               // country
            this.#__result.etablissement.code_commune,                  // postal_code
            this.#__result.etablissement.siren,                         // siren
            this.#__result.etablissement.nic,                           // nic
            this.#__result.etablissement.unite_legale.date_creation,    // creation_date
            this.#__result.etablissement.unite_legale.tranche_effectifs // staff_range
        ]
        for (const i in form_inputs) {
            const key = parseInt(i, 10);
            if (res_form[key - 1] !== undefined) {
                if (!(key === 0)) {
                    form_inputs[key].value = res_form[key - 1];
                }
            }
        }
    }

    async verify_siret_number() {
        if (this.check_count_and_content()) {
            if (this.check_luhn()) {
                if (await this.search_company()) {
                    this.insert_in_form()
                } else {
                    // show not_find error in html
                    const error = new Show_error("not_find", "siret");
                    error.show();
                }
            } else {
                // show invalid error in html
                const error = new Show_error("invalid", "siret");
                error.show();
            }
        } else {
            // show invalid_content error in html
            const error = new Show_error("invalid_content", "siret");
            error.show();
        }
    }
}


const form_inputs = document.querySelectorAll("input");

let siret = document.querySelector('#entreprise_siret');


// mcdo 72200393602320
// reunault 78012998703591
// coca 41522177900010


siret.addEventListener('input', event => {
    const button_search = document.querySelector('.fill_in_width_siret');
    if (siret.value.length === 14) {
        button_search.style.display = "block";
    }
});


document.querySelector('.fill_in_width_siret').addEventListener('click', event => {
    event.preventDefault();


    const siret_nb = new Siret(siret.value)
    siret_nb.verify_siret_number()

})






