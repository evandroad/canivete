function data() {
  return {
    filter: 'random',
    response: '',
    number: '',
    format: '',
    util: {
      symbols: ['','!','\\','#','$','%','&','(',')','*','+',',','-','.','/',':',';','<','=','>','?','@','[','\\',']','^','_','`','{','|','}','~'],
      getUpperCase() { return String.fromCharCode(this.getRandom(65, 90)) },
      getLowerCase() { return String.fromCharCode(this.getRandom(97, 122)) },
      getNumber() { return this.getRandomInt(9) },
      getSymbols() { return this.symbols[this.getRandomInt(this.symbols.length - 1)] },
      getRandomInt(max) { return Math.floor(Math.random() * max + 1) },
      getRandom(min, max) { return Math.floor(Math.random() * (max - min) + min) }
    },
    init() {
      var filters = document.querySelectorAll(".filters span")

      filters.forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelector("span.active").classList.remove("active")
          this.filter = btn.id
          btn.classList.add("active")
          this.clear()
        })
      })
    },
    generateRandom() {
      this.response = ''

      for (var i = 0; i < this.number; i++) {
        switch (this.util.getRandomInt(4)) {
          case 1:
            this.response += this.util.getUpperCase()
            break;
          case 2:
            this.response += this.util.getLowerCase()
            break;
          case 3:
            this.response += this.util.getNumber()
            break;
          case 4:
            this.response += this.util.getSymbols()
            break;
          default:
            break;
        }
      }

      console.log(this.resp)
    },
    generateFormatted() {
      this.response = ''
  
      for (var i = 0; i < this.format.length; i++) {
        switch (this.format.slice(i, i + 1)) {
          case 'M':
            this.response += this.util.getUpperCase()
            break;
          case 'm':
            this.response += this.util.getLowerCase()
            break;
          case 'n':
            this.response += this.util.getNumber()
            break;
          case 's':
            this.response += this.util.getSymbols()
            break;
          default:
            break;
        }
      }
    },
    clear() {
      this.number = ''
      this.format = ''
      this.response = ''
    }
  }
}