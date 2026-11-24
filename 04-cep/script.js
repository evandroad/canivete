const { createApp } = Vue

createApp({
  data() {
    return {
      cep: '',
      address: null,
      addressError: '',
      estado: '',
      cidade: '',
      rua: '',
      msgCeps: '',
      ceps: []
    }
  },

  methods: {
    async consultaCep() {
      try {
        var url = `https://viacep.com.br/ws/${this.cep}/json/`
        const response = await fetch(url)
        this.address = await response.json()
        
        if (this.address.erro) {
          this.addressError = 'Endereço não encontrado.'
          this.address = null
        } else {
          this.addressError = ''
        }
      } catch {
        this.addressError = 'Endereço não encontrado.'
      }
    },
    limparCampos() {
      this.cep = ''
      this.address = null
      this.addressError = ''
    },
    async consultaEndereco() {
      try {
        if (this.estado.length < 2 || this.cidade.length < 3 || this.rua.length < 3) {
          this.msgCeps = 'Preencha todos os campos corretamente'
          return
        }

        const url = `https://viacep.com.br/ws/${this.estado}/${this.cidade}/${this.rua}/json/`
        const response = await fetch(url)
        this.ceps = await response.json()
                    
        if (this.ceps.length <= 0) {
          this.msgCeps = 'Nenhum CEP encontrado'
          return
        }
        
        this.msgCeps = ''
      } catch {
        this.msgCeps = 'CEP não encontrado'
      }
    },
    limparCeps() {
      this.estado = ''
      this.cidade = ''
      this.rua = ''
      this.msgCeps = ''
      this.ceps = []
    }
  }

}).mount('#app')