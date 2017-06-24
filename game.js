(function drawBoard(window) {
    var stage = new Konva.Stage({
        container: '.board',
        width: window.innerWidth,
        height: window.innerHeight
    });
    var board = new Konva.Layer({});

    stage.add(board);

    function Rig(board) {
        var self = this;

        var scale = 0.75;

        var group = new Konva.Group({
            x: board.width() * (1 - scale),
            y: board.height() * (1 - scale),
            width: board.width() * scale,
            height: board.height() * scale
        });
        board.add(group);
        var box = new Konva.Rect({
            width: group.width(),
            height: group.height(),
            fill: '#093624'
        });
        group.add(box);

        var rows = [];

        this.totalSourceHeight = function totalSourceHeight() {
            return rows.reduce(
                function sumHeights(currentTotal, nextRow) {
                    return currentTotal + nextRow.maxSourceHeight();
                },
                0
            );
        };

        function addRow(name) {
            var row = new Row(name, group, rows.slice(), self);
            rows.push(row);
            return row;
        }

        this.programs = addRow("programs");
        this.hardware = addRow("hardware");
        this.resources = addRow("resources");

        this.draw = function draw() {
            rows.forEach(
                function drawRow(row) {
                    row.draw();
                }
            );
            board.draw();
        };

        group.on(
            "click",
            function installDummyCard() {
                new Hardware("10042").install(self);
            }
        );
    }

    function Row(name, group, rowsAbove, rig) {
        var self = this;

        this.name = name;
        this.rowsAbove = rowsAbove;

        var cards = [];

        this.maxSourceHeight = function maxSourceHeight() {
            return cards.reduce(
                function maximizeHeight(currentMax, card) {
                    return Math.max(currentMax, card.sourceHeight);
                },
                0
            );
        };

        this.installCard = function install(card) {
            cards.push(card);
            group.add(card.group);
            rig.draw();
        };

        this.draw = function draw() {
            var totalSourceWidth = cards.reduce(
                function sumWidths(totalWidth, card) {
                    return totalWidth + card.sourceWidth;
                },
                0
            );

            var heightOfRowsAbove = self.rowsAbove.reduce(
                function sumRowHeight(currentMax, row) {
                    return currentMax + row.maxSourceHeight();
                },
                0
            );

            var rowHeightProportion = self.maxSourceHeight() / rig.totalSourceHeight();
            var xScale = group.width() / totalSourceWidth;
            var yScale = rowHeightProportion * group.height() / self.maxSourceHeight();
            var scale = Math.min(xScale, yScale);
            var cardsDrawn = 0;
            cards.forEach(
                function rescaleCards(card) {
                    card.group.scale({
                        x: scale,
                        y: scale
                    });
                    card.group.x(cardsDrawn * card.sourceWidth * scale);
                    card.group.y(heightOfRowsAbove * scale);
                    card.draw();
                    cardsDrawn++;
                }
            );
        };
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

        var box = new Konva.Rect({
            x: 0,
            y: 0,
            width: self.sourceWidth,
            height: self.sourceHeight,
            fill: 'darkslateblue',
            stroke: 'black',
            strokeWidth: 4
        });
        var label = new Konva.Text({
            x: 5,
            y: 5,
            text: "Card " + dbId,
            fontSize: 30,
            fill: 'white'
        });
        this.group.add(box);
        this.group.add(label);

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

    var rig = new Rig(board);
    new Program("13006").install(rig);
    new Program("10005").install(rig);
    new Program("01028").install(rig);
    new Hardware("01024").install(rig);
    new Hardware("02085").install(rig);
    new Resource("05048").install(rig);
    new Program("11024").install(rig);

})(window);