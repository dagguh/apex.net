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

        var programs = [];

        this.installProgram = function install(program) {
            programs.push(program);
            function sumWidths(totalWidth, program) {
                return totalWidth + program.sourceWidth;
            }

            group.add(program.group);
            var rowScale = group.width() / programs.reduce(sumWidths, 0);
            var installedProgramsDrawn = 0;
            programs.forEach(
                function rescaleInstalledPrograms(installedProgram) {
                    installedProgram.group.scale({
                        x: rowScale,
                        y: rowScale
                    });
                    installedProgram.group.x(installedProgramsDrawn * program.sourceWidth * rowScale);
                    installedProgramsDrawn++;
                }
            );
            board.draw();
        }
    }

    function Program(dbId) {
        var program = this;
        this.sourceWidth = 300;
        this.sourceHeight = 212;
        this.group = new Konva.Group({
            clip: {
                x: 0,
                y: 0,
                width: program.sourceWidth,
                height: program.sourceHeight
            },
            draggable: true
        });

        this.install = function install(rig) {
            rig.installProgram(program);
            var image = new Image();
            image.onload = function drawImage() {
                var raster = new Konva.Image({
                    image: image,
                    width: image.width,
                    height: image.height
                });
                program.group.add(raster);
                program.group.draw();
            };
            program.group.on(
                "mouseover",
                function zoom() {
                    program.group.moveToTop();
                    program.group.draw();
                }
            );
            image.src = "https://netrunnerdb.com/card_image/" + dbId + ".png";
        }
    }

    new Program("13006").install(rig);
    new Program("10005").install(rig);
    new Program("01028").install(rig);

})(window);