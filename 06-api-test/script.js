function data() {
	return {
		data: {
			urls: [''],
			requests: []
		},
		formRequest: {},
		url: '',
		token: '',
		result: '',
		status: '',
		addUrl: '',
		addFolder: '',
		activeLink: null,
		isLoading: false,
		showInsertUrl: false,
		showCreateFolder: false,
		selectedRequest: null,
		isContextMenuVisible: false,
		isContextMenuFolderVisible: false,
		isContextMenuFoldersVisible: false,
		contextMenuPosition: { x: 0, y: 0 },
		link: {
			backgroundColor: '#243544',
			borderRadius: '5px',
			marginLeft: '-5px',
			paddingLeft: '5px',
			paddingRight: '5px',
			color: '#66b3ff'
		},
		linkFolder: {
			backgroundColor: '#243544',
			borderRadius: '5px',
			marginLeft: '8px',
			paddingLeft: '5px',
			paddingRight: '5px',
			color: '#66b3ff'
		},
		init() {
			this.loadData()
		},
		loadData() {
			if (JSON.parse(localStorage.getItem('config'))) {
				this.data = JSON.parse(localStorage.getItem('config'))
			}
	
			this.url = this.data.urls[0]
		},
		handleItem(item) {
			this.activeLink = item;

			this.formRequest = {
				name: item.name || '',
				method: item.method || '',
				endpoint: item.endpoint || '',
				body: item.body ? JSON.stringify(item.body, null, 2) : '',
				folder: item.folder || ''
			};

			this.result = '';
			this.status = '';
		},
		isActive(item) {
			return this.activeLink === item
		},
		makeRequest() {
			if (this.formRequest.method == undefined) {
				alert('Escolha um método.')
				return
			}
	
			this.isLoading = true

			var options = {
				method: this.formRequest.method,
				headers: {
					'Content-Type': 'application/json'
				}
			}
			
			if (this.token != '') {
				options.headers.Authorization = this.token
			}
	
			if (this.formRequest.method === 'POST' || this.formRequest.method === 'PUT') {
				options.body = this.formRequest.body
			}
		
			fetch(this.url + this.formRequest.endpoint, options)
				.then(response => {
					this.status = response.status

          if (response.status === 204) {
						this.result = '204 No Content'
						this.isLoading = false
						return null
          }

					return response.json()
				})
				.then(data => {
          if (data === null) return

					this.result = JSON.stringify(data, null, 2)
	
					if (data.hasOwnProperty('token')) {
						this.token = data.token
					}
	
					this.isLoading = false
				})
				.catch(error => {
					this.result = 'Erro:' + error
					this.isLoading = false
				})
	
		},
		clearFields() {
			this.formRequest = {}
			this.token = ''
			this.result = ''
			this.status = ''
			this.activeLink = null
		},
		saveFile() {
			this.download('config.json', JSON.stringify(this.data, null, 2))
		},
		download(filename, text) {
			var element = document.createElement('a')
			element.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(text))
			element.setAttribute('download', filename)
			element.style.display = 'none'
			document.body.appendChild(element)
			element.click()
			document.body.removeChild(element)
		},
		openInsertUrl() {
			if (this.data.urls.length <= 0) {
				this.addUrl = this.url
			}
			this.showInsertUrl = true
			this.$nextTick(() => this.$refs.urlInput.focus())
		},
		insertUrl() {
			if (this.data.urls.includes(this.addUrl)) {
				this.showNotification('URL já adicionada.', 'error')
			} else {
				this.data.urls.push(this.addUrl)
				this.url = this.addUrl
				this.addUrl = ''
				localStorage.setItem('config', JSON.stringify(this.data))
			}

			this.showInsertUrl = false
		},
		removeUrl() {
			const indice = this.data.urls.indexOf(this.url)
			
			if (indice !== -1) {
				this.data.urls.splice(indice, 1)
			}
	
    	this.url = this.data.urls[0] || ''
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		handleFileSelect() {
			var fileInput = document.getElementById('formFile')
			var file = fileInput.files[0]
			if (file) {
				this.readFileAsync(file)
					.then(fileContent => {
						this.data = JSON.parse(fileContent)
						this.url = this.data.urls[0]
						localStorage.setItem('config', JSON.stringify(this.data))
					})
					.catch(error => {
						console.error('Erro na leitura do arquivo:', error)
					})
			}
		},
		readFileAsync(file) {
			return new Promise((resolve, reject) => {
				var reader = new FileReader()
				reader.onload = e => resolve(e.target.result)
				reader.onerror = e => reject(e)
				reader.readAsText(file)
			})
		},
		saveRequest() {
			if (!this.formRequest.name) {
				alert('Por favor, preencha o nome da requisição.')
				return
			}

			if (!this.activeLink) {
				this.createRequest()
				return
			}
		
			const request = {
				...this.activeLink,
				id: this.activeLink.id || crypto.randomUUID(),
				name: this.formRequest.name,
        method: this.formRequest.method,
        endpoint: this.formRequest.endpoint,
				folder: this.activeLink.folder || ''
    	}
		
			if (this.formRequest.method == 'POST' || this.formRequest.method == 'PUT') {
				try {
					const requestBody = JSON.parse(this.formRequest.body)
					request.body = typeof requestBody === 'object' && requestBody !== null ? requestBody : {}
				} catch (error) {
					request['body'] = {}
				}
			}

			const index = this.data.requests.findIndex(r => r.id === this.activeLink.id)

			if (index !== -1) {
				this.data.requests.splice(index, 1, request)
				this.activeLink = request
			} else {
				console.log('Request não encontrado:', this.activeLink)
			}

			localStorage.setItem('config', JSON.stringify(this.data))
			this.showNotification('Requisição salva com sucesso!')
		},
		createRequest() {
			if (!this.formRequest.name) {
				alert('Por favor, preencha o nome da requisição.')
				return
			}

			const request = {
				...this.activeLink,
				...this.request,
				id: crypto.randomUUID(),
				name: this.formRequest.name,
				method: this.formRequest.method || '',
        endpoint: this.formRequest.endpoint,
				folder: ''
			}
	
			if (this.formRequest.method == 'POST' || this.formRequest.method == 'PUT') {
				request['body'] = JSON.parse(this.formRequest.body)
			}

			this.activeLink = request
		
			this.data.requests.push(request)
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		removeRequest() {
			this.data.requests = this.data.requests.filter(objeto => objeto.id !== this.activeLink.id)
			this.method = ''
			this.endpoint = ''
			this.body = ''
			this.activeLink = null
			this.formRequest = {}
			localStorage.setItem('config', JSON.stringify(this.data))
		},
		showContextMenuRequest(event, request) {
			event.preventDefault()
			this.contextMenuPosition = { x: event.pageX, y: event.pageY }
			this.isContextMenuVisible = true
			this.selectedRequest = request
			document.addEventListener('click', this.closeContextMenuOutside)
		},
		showContextMenuFolders(event) {
			event.preventDefault()
			this.contextMenuPosition = { x: event.pageX, y: event.pageY }
			this.isContextMenuFoldersVisible = true
			this.isContextMenuVisible = false
			document.addEventListener('click', this.closeContextMenuOutside)
		},
		showContextMenuFolder(event, folder) {
			event.preventDefault()
			this.selectedFolder = folder;
			this.contextMenuPosition = { x: event.pageX, y: event.pageY }
			this.isContextMenuFolderVisible = true
			this.isContextMenuFoldersVisible = false
			this.isContextMenuVisible = false
			document.addEventListener('click', this.closeContextMenuOutside)
		},
		closeContextMenuOutside(event) {
			if (!event.target.closest('.context-menu') && !event.target.hasAttribute('contextmenu')) {
				this.isContextMenuVisible = false
				this.isContextMenuFolderVisible = false
				this.isContextMenuFoldersVisible = false
				document.removeEventListener('click', this.closeContextMenuOutside)
			}
		},
		moveRequestToPosition(action) {
			const requests = this.data.requests
			const currentIndex = requests.indexOf(this.selectedRequest)

			if (currentIndex === -1) return

			const currentFolder = this.selectedRequest.folder || ''
			const folderRequests = requests.filter(req => (req.folder || '') === currentFolder)
			const folderIndex = folderRequests.indexOf(this.selectedRequest)
			const newFolderIndex = action === 'up' ? folderIndex - 1 : folderIndex + 1

			if (newFolderIndex < 0 || newFolderIndex >= folderRequests.length) return

			const targetRequest = folderRequests[newFolderIndex]
			const targetIndex = requests.indexOf(targetRequest)

			const temp = requests[currentIndex]
			requests[currentIndex] = requests[targetIndex]
			requests[targetIndex] = temp

			localStorage.setItem('config', JSON.stringify(this.data))
			this.isContextMenuVisible = false
		},
		moveRequestUp() {
			this.moveRequestToPosition('up')
		},
		moveRequestDown() {
			this.moveRequestToPosition('down')
		},
		moveFolderToPosition(action) {
			const folders = this.data.folders

			const currentIndex = folders.indexOf(this.selectedFolder)
			const newIndex = action === 'up' ? currentIndex - 1 : currentIndex + 1

			if (currentIndex === -1 || newIndex < 0 || newIndex >= folders.length) return

			const [folder] = folders.splice(currentIndex, 1)
			folders.splice(newIndex, 0, folder)

			this.data.requests.sort((a, b) => {
				const indexA = folders.indexOf(a.folder)
				const indexB = folders.indexOf(b.folder)
				return (indexA === -1 ? folders.length : indexA) - (indexB === -1 ? folders.length : indexB)
			})

			localStorage.setItem('config', JSON.stringify(this.data))
			this.isContextMenuFolderVisible = false
		},
		moveFolderUp() {
			this.moveFolderToPosition('up')
		},
		moveFolderDown() {
			this.moveFolderToPosition('down')
		},
		newFolder() {
			if (!this.data.folders) this.data.folders = []
			this.data.folders.push(this.addFolder)
			this.addFolder = ''
			localStorage.setItem('config', JSON.stringify(this.data))
			this.showCreateFolder = false
		},
		moveRequest(folder) {
			const request = this.data.requests.find(req => req.id === this.selectedRequest.id)
			
			if (request) request.folder = folder
			
			localStorage.setItem('config', JSON.stringify(this.data))
			this.isContextMenuFoldersVisible = false
		},
		moveOutOfTheFolder() {
			const request = this.data.requests.find(req => req.id === this.selectedRequest.id)
			
			if (request) request.folder = ''

			localStorage.setItem('config', JSON.stringify(this.data))
			this.isContextMenuVisible = false
		},
		deleteFolder() {
  		const folder = this.selectedFolder

			this.data.folders = this.data.folders.filter(item => item !== folder)
			this.data.requests = this.data.requests.filter(request => request.folder !== folder)

			localStorage.setItem('config', JSON.stringify(this.data))

			this.selectedFolder = null
			this.isContextMenuFolderVisible = false
		},
		showNotification(message, type = 'success') {
			const notification = document.createElement('div')

			const colors = {
				success: 'bg-green-800',
				error: 'bg-red-800',
				warning: 'bg-yellow-800',
				info: 'bg-blue-800'
			}

			notification.textContent = message
			notification.className = `
				fixed top-5 left-1/2 -translate-x-1/2 z-[9999]
				${colors[type] || colors.info}
				text-white px-4 py-3 rounded-lg shadow-lg
				transition-opacity duration-300
			`

			document.body.appendChild(notification)

			setTimeout(() => {
				notification.classList.add('opacity-0')
				setTimeout(() => notification.remove(), 300)
			}, 3000)
		}
	}
}
