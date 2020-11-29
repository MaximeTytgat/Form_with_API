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

    fetch(`https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${siret.value}`).then(async res => {
        const result = await res.json();
        const res_form = [
            result.etablissement.unite_legale.sigle,            // name
            result.etablissement.geo_l4,                        // address
            result.etablissement.libelle_commune,               // country
            result.etablissement.code_commune,                  // postal_code
            result.etablissement.siren,                         // siren
            result.etablissement.nic,                           // nic
            result.etablissement.unite_legale.date_creation,    // creation_date
            result.etablissement.unite_legale.tranche_effectifs // staff_range
        ]
        for (const i in form_inputs) {
            const key = parseInt(i, 10);
            if (res_form[key - 1] !== undefined) {
                if (!(key === 0)) {
                    form_inputs[key].value = res_form[key - 1];
                }
            }
        }
    });
})