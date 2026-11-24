function data() {
  return {
    resultado: "",
    insert(num) { this.resultado = this.resultado + num },
    clean() { this.resultado = '' },
    apagar() { this.resultado = this.resultado.slice(0,-1) },
    calcular() {
      var res = eval(this.resultado)
      this.resultado = String(res).slice(0, 9)
    }
  }
}