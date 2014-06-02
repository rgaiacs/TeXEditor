/* Generate preview of current (La)TeX source code. */
function preview() {
    var preview_div = document.getElementById("tex-preview");

    // Remove old preview
    while (preview_div.hasChildNodes()) {
        preview_div.removeChild(preview_div.lastChild);
    }

    // Get text and split paragraphs
    var text = document.getElementById("tex-input");
    var paragraphs = text.value.split('\n\n');

    // Parse paragraphs
    for(var i = 0; i < paragraphs.length; i++) {
      var html_paragraphs = document.createElement("p");
      html_paragraphs.innerHTML = TeXZilla.filterString(paragraphs[i]);
      preview_div.appendChild(html_paragraphs);
    }
}

/* Save current (La)TeX source code. */
function save_file() {
    var date = new Date();
    var text = document.getElementById("tex-input");
    var sdcard = navigator.getDeviceStorage('sdcard');
    var file = new Blob([text.value], {
        type: "text/plain"
    });

    // TODO: Fix `Unable to write the file [object DOMError]` with
    //
    //var request = sdcard.addNamed(file, "unknow-" + date.toUTCString().replace(' ', '-', 'g') + ".tex");
    var request = sdcard.add(file);

    request.onsuccess = function() {
        console.log("File successfully wrote as " + this.result);
    };

    request.onerror = function() {
        console.warn("Unable to write the file. " + this.error);
    };
}

/* Open file from list. */
function open_file() {
    var sdcard = navigator.getDeviceStorage('sdcard');

    var request = sdcard.get(this.innerHTML);

    request.onsuccess = function() {
        var file = request.result;
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function() {
            var text = document.getElementById("tex-input");
            text.value = this.result;
        };

        reader.onerror = function() {
            console.log("Error on read file. " + this.error);
        };

        // Go to editor
        document.querySelector("#btn-file-browser-close").click();
    };

    request.onerror = function() {
        console.warn("Unable to open file. " + this.error);
    };
}

/* List files at SD Card. */
function list_files() {
    var list_div = document.getElementById("file-browser-div");

    // Clean old list
    list_div.removeChild(list_div.lastChild);

    // Add new list
    var list = document.createElement('ul');
    list_div.appendChild(list);

    var sdcard = navigator.getDeviceStorage("sdcard");

    var cursor = sdcard.enumerate();

    cursor.onsuccess = function() {
        if (this.result) {
            var filename = this.result.name;

            if (filename.endsWith('.tex') || filename.endsWith('.txt')) {
                var new_file = document.createElement('li');
                new_file.innerHTML = filename;
                new_file.addEventListener('click', open_file);
                list.appendChild(new_file);
            }

            this.continue();
        }
    };

    cursor.onerror = function() {
        alert(this.error);
    };
}
