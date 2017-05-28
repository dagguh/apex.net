(function startGame(document) {

    function Program(imageUrl) {
        this.install = function installProgram(rig) {
            installInRig("program", rig, ".program-zone", imageUrl)
        }
    }

    function Hardware(imageUrl) {
        this.install = function installHardware(rig) {
            installInRig("hardware", rig, ".hardware-zone", imageUrl)
        }
    }

    function Resource(imageUrl) {
        this.install = function installResource(rig) {
            installInRig("resource", rig, ".resource-zone", imageUrl)
        }
    }

    function installInRig(type, rig, rowSelector, imageUrl) {
        var row = rig.querySelector(rowSelector);
        var installation = document.createElement("div");
        installation.classList.add("installed");
        var card = document.createElement("div");
        card.classList.add(type);
        var image = document.createElement("img");
        image.setAttribute("src", imageUrl);
        card.appendChild(image);
        installation.appendChild(card);
        row.appendChild(installation);
    }

    var rig = document.querySelector(".rig");

    new Program("https://netrunnerdb.com/card_image/13006.png").install(rig);
    new Program("https://netrunnerdb.com/card_image/10005.png").install(rig);
    new Hardware("https://netrunnerdb.com/card_image/01024.png").install(rig);
    new Resource("https://netrunnerdb.com/card_image/05048.png").install(rig);

    document.querySelector(".spy-camera").onclick = function installSpyCamera() {
        new Hardware("https://netrunnerdb.com/card_image/10042.png").install(rig);
    }
})(document);