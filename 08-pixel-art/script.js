const { createApp } = Vue

createApp({
  data() {
    return {
      columns: 8,
      rows: 8,
      pixelSize: 1,
      pixels: [],
      recentColors: [],
      selectedPixel: null,
      selectedPixels: new Set(),
      selectedColor: '#f53935',
      maxRecentColors: 12
    }
  },

  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.columns}, 28px)`
      }
    }
  },

  methods: {
    initializeGrid() {
      this.pixels = Array.from(
        { length: this.rows },
        () => Array(this.columns).fill('#ffffff')
      )
    },

    resizeGrid() {
      this.columns = Math.max(1, Math.min(100, parseInt(this.columns) || 1))
      this.rows = Math.max(1, Math.min(100, parseInt(this.rows) || 1))

      const newPixels = Array.from({ length: this.rows }, (_, row) =>
        Array.from({ length: this.columns }, (_, col) =>
          this.pixels[row]?.[col] || '#ffffff'
        )
      )

      this.pixels = newPixels

      this.selectedPixels = new Set(
        [...this.selectedPixels].filter(position => {
          const [row, col] = position.split('-').map(Number)
          return row < this.rows && col < this.columns
        })
      )

      if (
        this.selectedPixel &&
        (this.selectedPixel.row >= this.rows || this.selectedPixel.col >= this.columns)
      ) {
        this.selectedPixel = null
      }
    },

    isPixelSelected(row, col) {
      return this.selectedPixels.has(`${row}-${col}`)
    },

    togglePixelSelection(row, col) {
      const position = `${row}-${col}`

      if (this.selectedPixels.has(position)) {
        this.selectedPixels.delete(position)
      } else {
        this.selectedPixels.add(position)
      }
    },

    openColorPicker(row, col) {
      this.selectedPixel = { row, col }
      this.selectedColor = this.pixels[row][col]
      this.$refs.colorDialog.showModal()
    },

    openColorPickerForSelection() {
      if (this.selectedPixels.size === 0) {
        alert('Selecione pelo menos um pixel.')
        return
      }

      const firstPosition = [...this.selectedPixels][0]
      const [row, col] = firstPosition.split('-').map(Number)

      this.selectedPixel = null
      this.selectedColor = this.pixels[row][col]
      this.$refs.colorDialog.showModal()
    },

    closeColorDialog() {
      this.$refs.colorDialog.close()
    },

    confirmColor() {
      this.applyPixelColor(this.selectedColor)
      this.closeColorDialog()
    },

    applyPixelColor(color) {
      if (this.selectedPixels.size > 0) {
        this.selectedPixels.forEach(position => {
          const [row, col] = position.split('-').map(Number)
          this.pixels[row][col] = color
        })

        this.selectedPixels.clear()
      } else if (this.selectedPixel !== null) {
        const { row, col } = this.selectedPixel
        this.pixels[row][col] = color
        this.selectedPixel = null
      }

      this.recentColors = [
        color,
        ...this.recentColors.filter(item => item !== color)
      ].slice(0, this.maxRecentColors)
    },

    saveProject() {
      const project = {
        version: 1,
        columns: this.columns,
        rows: this.rows,
        pixelSize: this.normalizePixelSize(),
        pixels: this.pixels,
        recentColors: this.recentColors
      }

      this.downloadFile(
        JSON.stringify(project, null, 2),
        `pixel-art-${this.columns}x${this.rows}.json`,
        'application/json'
      )
    },

    async handleProjectFile(event) {
      const file = event.target.files[0]
      if (!file) return

      await this.openProject(file)
      event.target.value = ''
    },

    async openProject(file) {
      try {
        const project = JSON.parse(await file.text())

        // Valida as informações básicas do projeto.
        if (
          project.version !== 1 ||
          !Number.isInteger(project.columns) ||
          !Number.isInteger(project.rows) ||
          !Number.isInteger(project.pixelSize) ||
          project.columns < 1 || project.columns > 100 ||
          project.rows < 1 || project.rows > 100 ||
          project.pixelSize < 1 || project.pixelSize > 1000
        ) {
          throw new Error('Arquivo de projeto inválido.')
        }

        // Valida a matriz de pixels.
        if (
          !Array.isArray(project.pixels) ||
          project.pixels.length !== project.rows ||
          !project.pixels.every(row =>
            Array.isArray(row) &&
            row.length === project.columns &&
            row.every(color =>
              typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)
            )
          )
        ) {
          throw new Error('Mapa de pixels inválido.')
        }

        this.columns = project.columns
        this.rows = project.rows
        this.pixelSize = project.pixelSize
        this.pixels = project.pixels.map(row => [...row])

        this.recentColors = Array.isArray(project.recentColors)
          ? project.recentColors
              .filter(color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color))
              .slice(0, this.maxRecentColors)
          : []

        this.selectedPixel = null
        this.selectedPixels.clear()
      } catch (error) {
        alert('Não foi possível abrir o projeto: ' + error.message)
      }
    },

    normalizePixelSize() {
      this.pixelSize = Math.max(1, Math.min(1000, parseInt(this.pixelSize) || 1))
      return this.pixelSize
    },

    savePng() {
      const pixelSize = this.normalizePixelSize()
      const canvas = document.createElement('canvas')

      canvas.width = this.columns * pixelSize
      canvas.height = this.rows * pixelSize

      const context = canvas.getContext('2d')
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)

      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.columns; col++) {
          context.fillStyle = this.pixels[row][col] || '#ffffff'
          context.fillRect(
            col * pixelSize,
            row * pixelSize,
            pixelSize,
            pixelSize
          )
        }
      }

      canvas.toBlob(blob => {
        if (!blob) {
          alert('Não foi possível criar o PNG.')
          return
        }

        this.downloadBlob(
          blob,
          `pixel-art-${this.columns}x${this.rows}-${pixelSize}px.png`
        )
      }, 'image/png')
    },

    downloadFile(content, filename, type) {
      const blob = new Blob([content], { type })
      this.downloadBlob(blob, filename)
    },

    downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = filename
      link.click()

      URL.revokeObjectURL(url)
    }
  },

  mounted() {
    this.initializeGrid()
  }
}).mount('#app')