if (!app.homeScreenVisible) {
	var layers = app.activeDocument.layers,
		docPath =  app.activeDocument.path

	var modalWindow = new Window ('dialog', "Select export option"),
		checkboxGroup = modalWindow.add ("group"),
		c1 = checkboxGroup.add ("radiobutton", undefined, "72"),
		c2 = checkboxGroup.add ("radiobutton", undefined, "150"),
		c3 = checkboxGroup.add ("radiobutton", undefined, "300"),

		antiAliasingC = modalWindow.add("checkbox", undefined, "Anti-aliasing"),
		clipArtboardC = modalWindow.add("checkbox", undefined, "Clip Artboard"),
		keepBgC = modalWindow.add("checkbox", undefined, "Keep background (the last layer)")

		c1.resolution = 72
		c2.resolution = 150
		c3.resolution = 300

		checkboxGroup.children[0].value=true

	var	buttonsGroup = modalWindow.add ("group"),
		jpegBtn = buttonsGroup.add ("button", undefined, "JPEG"),
		pngBtn = buttonsGroup.add ("button", undefined, "PNG")


	
		jpegBtn.onClick = function(){
			var resolution = getResolution(checkboxGroup)
			exportEachLayer(resolution,  ".jpeg")
			modalWindow.close()
		}	
		pngBtn.onClick = function(){
			var resolution = getResolution(checkboxGroup)
			exportEachLayer(resolution,  ".png")
			modalWindow.close()
		}


	function getResolution (checkboxes) {
		for (i = 0; i < checkboxes.children.length; i++) {
		if (checkboxes.children[i].value == true) {
		return checkboxes.children[i].resolution;
			}
		}
	}

	modalWindow.show()

	function exportEachLayer (resolution, format){
		var numberOfLayers
		if (!keepBgC.value) {
			numberOfLayers=layers.length
		} else {
			numberOfLayers=layers.length-1
		}

		if (format==".png"){
			for (a=0; a<numberOfLayers; a++){
				hideLayers();
				layers[a].visible=true;
				exportAsPNG(layers[a].name, resolution, antiAliasingC.value, clipArtboardC.value);
			}
		} else {
			for (a=0; a<numberOfLayers; a++){
				hideLayers();
				layers[a].visible=true;
				exportAsJPEG(layers[a].name, resolution, antiAliasingC.value, clipArtboardC.value);
			}
		}
	}

	function exportAsPNG (curentLayer, resolution, antiAliasing, clipArtboard) {
		var exportOptions = new ImageCaptureOptions();
		exportOptions.antiAliasing = antiAliasing;
		exportOptions.qualitySetting = 100;
		exportOptions.resolution = resolution
		exportOptions.transparency=true
		
		var indexAA = app.activeDocument.artboards.getActiveArtboardIndex (),
	        activeArtboard = app.activeDocument.artboards[indexAA]

		var rect = defineArtboard(clipArtboard)

		var fileSpec = new File(docPath+'/'+curentLayer+".png");
	
		app.activeDocument.imageCapture(fileSpec, rect, exportOptions);
	}

	function exportAsJPEG (curentLayer, resolution, antiAliasing, clipArtboard) {
		var exportOptions = new ExportOptionsJPEG();
		var type = ExportType.JPEG;
		exportOptions.antiAliasing = antiAliasing;
		exportOptions.qualitySetting = 100;
		exportOptions.artBoardClipping = false;
		exportOptions.horizontalScale = resolution*100/72;
		exportOptions.verticalScale = resolution*100/72;
    	exportOptions.artBoardClipping = clipArtboard

		var fileSpec = new File(docPath+'/'+curentLayer);

		app.activeDocument.exportFile( fileSpec, type, exportOptions );

	}



	function hideLayers(){
		if (!keepBgC.value){
			for (i=0; i<layers.length; i++){
				layers[i].visible=false
			}
		} else {
			for (i=0; i<layers.length-1; i++){
				layers[i].visible=false
			}
		}
	}

	function defineArtboard(clipArtboard){
		var indexAA = app.activeDocument.artboards.getActiveArtboardIndex (),
		activeArtboard = app.activeDocument.artboards[indexAA]

		var rect;
		if (clipArtboard){
			rect = activeArtboard.artboardRect
		} else {
			rect = app.activeDocument.geometricBounds
		}

		return rect
	}

} else {
	alert("Please open the document first")
}

