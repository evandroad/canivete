function data() {
  return {
    quantity: '',
    coinFrom: '',
    coinTo: '',
    response: '',
    consultaMoeda() {
      if (this.quantity == '') {
        alert("Quantidade não pode ser vazio.")
        return
      }

      if (this.coinFrom == '') {
        alert("Moeda 'DE' não pode ser vazio.")
        return
      }

      if (this.coinTo == '') {
        alert("Moeda 'PARA' não pode ser vazio.")
        return
      }

      var url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`
      var endpoint = `/${this.coinFrom}.json`
      fetch(url + endpoint)
        .then(res => res.json())
        .then(data => {
          var total = data[this.coinFrom][this.coinTo] * this.quantity
          this.response = `
            Moeda:  ${this.coinFrom} -> ${this.coinTo}<br> 
            Valor:  ${total.toLocaleString('pt-br',{minimumFractionDigits: 2, maximumFractionDigits: 2})}
          ` 
        })
        .catch(e => console.log(e))
    },
    inverter() {
      var aux = this.coinFrom
      this.coinFrom = this.coinTo
      this.coinTo = aux
    },
    limpar() {
      this.quantity = ''
      this.coinFrom = ''
      this.coinTo = ''
      this.response = ''
    },
    coins: [
      {sigla:"aed", moeda: "Dirham dos Emirados",       pais: "Afeganistão"},
      {sigla:"all", moeda: "Lek",                       pais: "Albânia"},
      {sigla:"ang", moeda: "Florim",                    pais: "Antilhas Holandesas"},
      {sigla:"aoa", moeda: "Kwanza",                    pais: "Angola"},
      {sigla:"ars", moeda: "Peso Argentino",            pais: "Argentina"},
      {sigla:"sar", moeda: "Riyal",                     pais: "Arábia Saudita"},
      {sigla:"dzd", moeda: "Dinar argelino",            pais: "Argélia"},
      {sigla:"amd", moeda: "Dram Armênia",              pais: "Armênia"},
      {sigla:"awg", moeda: "Florim de Aruba",           pais: "Aruba"},
      {sigla:"aud", moeda: "Dólar australiano",         pais: "Austrália"},
      {sigla:"azn", moeda: "Manat do Azerbaijão",       pais: "Azerbaijão"},
      {sigla:"bsd", moeda: "Dólar das Bahamas",         pais: "Bahamas"},
      {sigla:"bhd", moeda: "Dinar do Bahrein",          pais: "Bahrein"},
      {sigla:"bdt", moeda: "Taka",                      pais: "Bangladesh"},
      {sigla:"bbd", moeda: "Dólar de Barbados",         pais: "Barbados"},
      {sigla:"bzd", moeda: "Dólar do Belize",           pais: "Belize"},
      {sigla:"bmd", moeda: "Dólar bermudense",          pais: "Bermudas"},
      {sigla:"byr", moeda: "Rublo bielorrusso",         pais: "Bielorrússia"},
      {sigla:"bam", moeda: "Marco convertível",         pais: "Bósnia e Herzegovina"},
      {sigla:"bwp", moeda: "Pula",                      pais: "Botswana"},
      {sigla:"bob", moeda: "Boliviano",                 pais: "Bolívia"},
      {sigla:"bgn", moeda: "Lev búlgaro",               pais: "Bulgária"},
      {sigla:"bif", moeda: "Franco do Burundi",         pais: "Burundi"},
      {sigla:"btn", moeda: "Ngultrum",                  pais: "Butão"},
      {sigla:"brl", moeda: "Real",                      pais: "Brasil"},
      {sigla:"bnd", moeda: "Dólar do Brunei",           pais: "Brunei"},
      {sigla:"cve", moeda: "Escudo cabo-verdiano",      pais: "Cabo Verde"},
      {sigla:"xaf", moeda: "Franco CFA central",        pais: "Camarões"},
      {sigla:"khr", moeda: "Riel",                      pais: "Camboja"},
      {sigla:"cad", moeda: "Dólar canadense",           pais: "Canadá"},
      {sigla:"qar", moeda: "Rial do Qatar",             pais: "Catar"},
      {sigla:"kzt", moeda: "Tenge",                     pais: "Cazaquistão"},
      {sigla:"clp", moeda: "Peso chileno",              pais: "Chile"},
      {sigla:"cny", moeda: "Renminbi",                  pais: "China"},
      {sigla:"cop", moeda: "Peso colombiano",           pais: "Colômbia"},
      {sigla:"crc", moeda: "Colon da Costa Rica",       pais: "Costa Rica"},
      {sigla:"kpw", moeda: "Won norte-coreano",         pais: "Coreia do Norte"},
      {sigla:"krw", moeda: "Won sul-coreano",           pais: "Coreia do Sul"},
      {sigla:"hrk", moeda: "Kuna croata",               pais: "Croácia"},
      {sigla:"cup", moeda: "Peso cubano",               pais: "Cuba"},
      {sigla:"dkk", moeda: "Coroa dinamarquesa",        pais: "Dinamarca"},
      {sigla:"egp", moeda: "Libra egípcia",             pais: "Egito"},
      {sigla:"ecs", moeda: "Sucre",                     pais: "Equador"},
      {sigla:"svc", moeda: "Colon de El Salvador",      pais: "El Salvador"},
      {sigla:"usd", moeda: "Dólar americano",           pais: "Estados Unidos"},
      {sigla:"ern", moeda: "Nakfa",                     pais: "Eritreia"},
      {sigla:"etb", moeda: "Birr etíope",               pais: "Etiópia"},
      {sigla:"eur", moeda: "Euro",                      pais: "Europa"},
      {sigla:"fjd", moeda: "Dólar das Fiji",            pais: "Fiji"},
      {sigla:"php", moeda: "Peso filipino",             pais: "Filipinas"},
      {sigla:"gmd", moeda: "Dalasi",                    pais: "Gâmbia"},
      {sigla:"ghs", moeda: "Cedi",                      pais: "Gana"},
      {sigla:"gel", moeda: "Lari",                      pais: "Geórgia"},
      {sigla:"gip", moeda: "Libra de Gibraltar",        pais: "Gibraltar"},
      {sigla:"gtq", moeda: "Quetzal guatemalteco",      pais: "Guatemala"},
      {sigla:"gyd", moeda: "Dólar da Guiana",           pais: "Guiana"},
      {sigla:"gnf", moeda: "Franco da Guiné",           pais: "Guiné"},
      {sigla:"htg", moeda: "Gourde",                    pais: "Haiti"},
      {sigla:"hnl", moeda: "Lempira",                   pais: "Honduras"},
      {sigla:"hkd", meoda: "Dólar de Hong Kong",        pais: "Hong Kong"},
      {sigla:"huf", moeda: "Forint",                    pais: "Hungria"},
      {sigla:"yer", moeda: "Rial iemenita",             pais: "Iêmen"},
      {sigla:"imp", moeda: "Libra manesa",              pais: "Ilha de Man"},
      {sigla:"kyd", moeda: "Dólar das Ilhas Cayman",    pais: "Ilhas Caimã"},
      {sigla:"fkp", moeda: "Libra das Malvinas",        pais: "Ilhas Malvinas"},
      {sigla:"sbd", moeda: "Dólar das Ilhas Salomão",   pais: "Ilhas Salomão"},
      {sigla:"idr", moeda: "Rupia indonésia",           pais: "Indonésia"},
      {sigla:"isk", moeda: "Coroa islandesa",           pais: "Islândia"},
      {sigla:"ils", moeda: "Shekel",                    pais: "Israel"},
      {sigla:"iqd", moeda: "Dinar iraquiano",           pais: "Iraque"},
      {sigla:"irr", moeda: "Rial iraniano",             pais: "Irão"},
      {sigla:"inr", moeda: "Rupia indiana",             pais: "Índia"},
      {sigla:"jmd", moeda: "Dólar jamaicano",           pais: "Jamaica"},
      {sigla:"jpy", moeda: "Iene",                      pais: "Japão"},
      {sigla:"jod", moeda: "Dinar jordano",             pais: "Jordânia"},
      {sigla:"kwd", moeda: "Dinar do Kuwait",           pais: "Kuwait"},
      {sigla:"lak", moeda: "Kip",                       pais: "Laos"},
      {sigla:"lvl", moeda: "Lats",                      pais: "Letônia"},
      {sigla:"lbp", moeda: "Libra libanesa",            pais: "Líbano"},
      {sigla:"lrd", moeda: "Dólar liberiano",           pais: "Libéria"},
      {sigla:"lyd", moeda: "Dinar líbio",               pais: "Líbia"},
      {sigla:"ltl", moeda: "Litas",                     pais: "Lituânia"},
      {sigla:"mop", moeda: "Pataca",                    pais: "Macau"},
      {sigla:"mkd", moeda: "Denar",                     pais: "Macedônia do Norte"},
      {sigla:"mga", moeda: "Ariary",                    pais: "Madagáscar"},
      {sigla:"myr", moeda: "Ringgit",                   pais: "Malásia"},
      {sigla:"mwk", moeda: "Kwacha",                    pais: "Malawi"},
      {sigla:"mvr", moeda: "Rufiyaa",                   pais: "Maldivas"},
      {sigla:"mur", moeda: "Rupia mauriciana",          pais: "Maurícia"},
      {sigla:"mro", moeda: "Ouguiya",                   pais: "Mauritânia"},
      {sigla:"mad", moeda: "Dirham marroquino",         pais: "Marrocos"},
      {sigla:"mxn", moeda: "Peso mexicano",             pais: "México"},
      {sigla:"mmk", moeda: "Kyat",                      pais: "Mianmar"},
      {sigla:"mzn", moeda: "Metical",                   pais: "Moçambique"},
      {sigla:"mdl", moeda: "Leu moldávio",              pais: "Moldávia"},
      {sigla:"mnt", moeda: "Tugrik",                    pais: "Mongólia"},
      {sigla:"nad", moeda: "Dólar da Namíbia",          pais: "Namíbia"},
      {sigla:"npr", moeda: "Rupia nepalesa",            pais: "Nepal"},
      {sigla:"nio", moeda: "Cordoba Oro",               pais: "Nicarágua"},
      {sigla:"ngn", moeda: "Naira",                     pais: "Nigéria"},
      {sigla:"nok", moeda: "Coroa norueguesa",          pais: "Noruega"},
      {sigla:"nzd", moeda: "Dólar da Nova Zelândia",    pais: "Nova Zelândia"},
      {sigla:"omr", moeda: "Rial Omani",                pais: "Omã"},
      {sigla:"pab", moeda: "Balboa",                    pais: "Panamá"},
      {sigla:"pgk", moeda: "Kina",                      pais: "Papua-Nova Guiné"},
      {sigla:"pkr", moeda: "Rupia paquistanesa",        pais: "Paquistão"},
      {sigla:"pyg", moeda: "Guarani",                   pais: "Paraguai"},
      {sigla:"pen", moeda: "Nuevo Sol",                 pais: "Peru"},
      {sigla:"pln", moeda: "Zloty",                     pais: "Polónia"},
      {sigla:"kes", moeda: "Xelim queniano",            pais: "Quênia"},
      {sigla:"kgs", moeda: "Som",                       pais: "Quirguistão"},
      {sigla:"gbp", moeda: "Libra Esterlina",           pais: "Reino Unido"},
      {sigla:"dop", moeda: "Peso",                      pais: "República Dominicana"},
      {sigla:"cdf", moeda: "Franco congolês",           pais: "República Democrática do Congo"},
      {sigla:"czk", moeda: "Coroa checa",               pais: "República Tcheca"},
      {sigla:"ron", moeda: "Leu romeno",                pais: "Roménia"},
      {sigla:"rwf", moeda: "Franco do Ruanda",          pais: "Ruanda"},
      {sigla:"rub", moeda: "Rublo",                     pais: "Rússia"},
      {sigla:"shp", moeda: "Libra de Santa Helena",     pais: "Santa Helena"},
      {sigla:"stn", moeda: "Dobra",                     pais: "São Tomé e Príncipe"},
      {sigla:"rsd", moeda: "Dinar Sérvio",              pais: "Sérvia"},
      {sigla:"scr", moeda: "Rupia das Seychelles",      pais: "Seicheles"},
      {sigla:"sll", moeda: "Leone",                     pais: "Serra Leoa"},
      {sigla:"sgd", moeda: "Dólar de Singapura",        pais: "Singapura"},
      {sigla:"syp", moeda: "Libra da Síria",            pais: "Síria"},
      {sigla:"sos", moeda: "Xelim somali",              pais: "Somália"},
      {sigla:"sdg", moeda: "Dinar sudanês",             pais: "Sudão"},
      {sigla:"lkr", moeda: "Rupia do Sri Lanka",        pais: "Sri Lanka"},
      {sigla:"sek", moeda: "Coroa Sueca",               pais: "Suécia"},
      {sigla:"chf", moeda: "Franco suíço",              pais: "Suíça"},
      {sigla:"srd", moeda: "Dólar do Suriname",         pais: "Suriname"},
      {sigla:"thb", moeda: "Baht",                      pais: "Tailândia"},
      {sigla:"twd", moeda: "Novo dólar de Taiwan",      pais: "Taiwan"},
      {sigla:"tjs", moeda: "Somoni",                    pais: "Tajiquistão"},
      {sigla:"tzs", moeda: "Xelim da Tanzânia",         pais: "Tanzânia"},
      {sigla:"top", moeda: "Pa'anga",                   pais: "Tonga"},
      {sigla:"tnd", moeda: "Dinar tunisino",            pais: "Tunísia"},
      {sigla:"tmt", moeda: "Manat turcomano",           pais: "Turquemenistão"},
      {sigla:"try", moeda: "Nova Lira turca",           pais: "Turquia"},
      {sigla:"ttd", moeda: "Dólar de Trindade e Tobago",pais: "Trindade e Tobago"},
      {sigla:"uah", moeda: "Grívnia",                   pais: "Ucrânia"},
      {sigla:"ugx", moeda: "Xelim ugandês",             pais: "Uganda"},
      {sigla:"uyu", moeda: "Peso uruguaio",             pais: "Uruguai"},
      {sigla:"uzs", moeda: "Som uzbeque",               pais: "Uzbequistão"},
      {sigla:"ves", moeda: "bolívar venezuelano",       pais: "Venezuela"},
      {sigla:"vnd", moeda: "Dong",                      pais: "Vietnã"},
      {sigla:"zmw", moeda: "Kwacha",                    pais: "Zâmbia"},
      {sigla:"zwl", moeda: "Dólar zimbabuano",          pais: "Zimbabwe"}
    ]
  }
}