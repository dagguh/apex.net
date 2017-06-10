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
        this.programs = new Row(board);
        this.hardware = new Row(board);
        this.resources = new Row(board);
    }

    function Row(board) {
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

            var totalWidth = cards.reduce(
                function sumWidths(totalWidth, card) {
                    return totalWidth + card.sourceWidth;
                },
                0
            );

            var maxHeight = cards.reduce(
                function maximizeHeight(currentMax, card) {
                    return Math.max(currentMax, card.sourceHeight);
                },
                0
            );

            group.add(card.group);
            var xScale = group.width() / totalWidth;
            var yScale = group.height() / maxHeight;
            var scale = Math.min(xScale, yScale);
            var cardsDrawn = 0;
            cards.forEach(
                function rescaleCards(card) {
                    card.group.scale({
                        x: scale,
                        y: scale
                    });
                    card.group.x(cardsDrawn * card.sourceWidth * xScale);
                    card.draw();
                    cardsDrawn++;
                }
            );
            board.draw();
        }
    }

    function Program(dbId) {
        var self = this;
        this.card = new Card(dbId, 300, 212);
        this.install = function install(rig) {
            rig.programs.installCard(self.card);
        }
    }

    function Hardware(dbId) {
        var self = this;
        this.card = new Card(dbId, 300, 230);
        this.install = function install(rig) {
            rig.hardware.installCard(self.card);
        };
    }

    function Resource(dbId) {
        var self = this;
        this.card = new Card(dbId, 300, 195);
        this.install = function install(rig) {
            rig.resources.installCard(self.card);
        };
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

        this.draw = function draw() {
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

    new Program("13006").install(rig);
    new Program("10005").install(rig);
    new Program("01028").install(rig);
    new Hardware("01024").install(rig);
    new Hardware("02085").install(rig);
    new Resource("05048").install(rig);

})(window);