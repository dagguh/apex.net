(function drawBoard(window) {
    var stage = new Konva.Stage({
        container: '.board',
        width: window.innerWidth,
        height: window.innerHeight
    });
    var board = new Konva.Layer({});

    stage.add(board);
    var rig = new Rig(board);

    function Rig(board) {
        var group = new Konva.Group({
            x: board.width() / 2,
            y: board.height() / 2,
            width: board.width() / 2,
            height: board.height() / 2
        });
        board.add(group);
        group.draw();

        var cards = [];

        this.installCard = function install(card) {
            cards.push(card);
            function sumWidths(totalWidth, card) {
                return totalWidth + card.sourceWidth;
            }

            group.add(card.group);
            var rowScale = group.width() / cards.reduce(sumWidths, 0);
            var cardsDrawn = 0;
            cards.forEach(
                function rescaleCards(card) {
                    card.group.scale({
                        x: rowScale,
                        y: rowScale
                    });
                    card.group.x(cardsDrawn * card.sourceWidth * rowScale);
                    cardsDrawn++;
                }
            );
            board.draw();
        }
    }

    function Program(dbId) {
        this.card = new Card(dbId, 300, 212)
    }

    function Hardware(dbId) {
        this.card = new Card(dbId, 300, 230)
    }

    function Resource(dbId) {
        this.card = new Card(dbId, 300, 195)
    }

    function Card(dbId, sourceWidth, sourceHeight) {
        var self = this;
        this.sourceWidth = sourceWidth;
        this.sourceHeight = sourceHeight;
        this.group = new Konva.Group({
            clip: {
                x: 0,
                y: 0,
                width: self.sourceWidth,
                height: self.sourceHeight
            },
            draggable: true
        });

        this.install = function install(rig) {
            rig.installCard(self);
            var image = new Image();
            image.onload = function drawImage() {
                var raster = new Konva.Image({
                    image: image,
                    width: image.width,
                    height: image.height
                });
                self.group.add(raster);
                self.group.draw();
            };
            self.group.on(
                "mouseover",
                function zoom() {
                    self.group.moveToTop();
                    self.group.draw();
                }
            );
            image.src = "images/" + dbId + ".png";
        }
    }

    new Program("13006").card.install(rig);
    new Program("10005").card.install(rig);
    new Program("01028").card.install(rig);
    new Hardware("01024").card.install(rig);
    new Hardware("02085").card.install(rig);
    new Resource("05048").card.install(rig);

})(window);