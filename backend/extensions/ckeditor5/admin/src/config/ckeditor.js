module.exports = {
    // Override toolbar config to leave a few buttons
    toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'link',
			'bulletedList',
			'numberedList',
			'imageInsert',
			'strapiMediaLib',
			'|',
			'alignment',
			'indent',
			'outdent',
			'|',
			'specialCharacters',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'htmlEmbed',
			'horizontalLine',
			'|',
			'undo',
			'redo'
		]
	},
	image: {
		styles: [
			'alignLeft',
			'alignCenter',
			'alignRight'
		],
		resizeOptions: [
			{
				name: 'imageResize:original',
				value: null,
				icon: 'original'
			},
			{
				name: 'imageResize:50',
				value: '50',
				icon: 'medium'
			},
			{
				name: 'imageResize:75',
				value: '75',
				icon: 'large'
			}
		],
		toolbar: [
			'imageStyle:alignLeft',
			'imageStyle:alignCenter',
			'imageStyle:alignRight',
			'|',
			'imageTextAlternative',
			'|',
			'imageResize:50',
			'imageResize:75',
			'imageResize:original',
			'|',
			'linkImage'
		]
	},
  };