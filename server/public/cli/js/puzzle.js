 var module = angular.module('puzzle', []);

 module.factory('puzzle', function() {
        function shuffle(a) {
            var q;
            for (var j, x, i = a.length; i; j = parseInt(Math.random() * i, 10), x = a[--i], a[i] = a[j], a[j] = x) { q = 0; }
            return a;
        }

        function puzzle(rows, cols) {
            
            this.grid = [];
            this.finded=false
            /**
             * Shuffles grid
             */
            this.shuffle = function(c) {
                var tiles = [];
                this.traverse(function(tile) {
                    tiles.push(tile);
                });
                shuffle(tiles);
                this.traverse(function(tile, row, col) {
                    this.grid[row][col] = tiles.shift();
                    if(c) tile.style['background-color']=c
                });
                this.finded=false

            };

            this.click = function(srow, scol) {
                if(this.grid[srow][scol].empty) this.finded=true
            }

            /**
             * Traverses grid and executes fn on every tile
             * @param fn
             */
            this.traverse = function(fn) {
                for (var row = 0; row < rows; row++) {
                    for (var col = 0; col < cols; col++) {
                        fn.call(this, this.grid && this.grid[row] ? this.grid[row][col] : undefined, row, col);
                    }
                }
            };

            // initialize grid
            var id = 1;
            this.traverse(function(tile, row, col) {
                if (!this.grid[row]) {
                    this.grid[row] = [];
                }
                this.grid[row][col] = {
                    id: id++,
                    empty: (row === rows - 1) && (col === cols - 1)
                };
                if (this.grid[row][col].empty) {
                    this.empty = this.grid[row][col];
                }
            });
        }

        return function(rows, cols) {
            return new puzzle(rows, cols);
        };
    });

 module.directive('puzzle', function(puzzle) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<table class="sliding-puzzle">' +
                '<tr ng-repeat="($row, row) in puzzle.grid">' +
                '<td ng-repeat="($col, tile) in row" ng-click="puzzle.click($row, $col)" ng-style="tile.style" ng-class="{\'puzzle-empty\': tile.empty}" title="{{tile.id}}"></td>' +
                '</tr>' +
                '</table>',
            scope: {
                size: '@',
                src: '@',
                color:'@',
                api: '='
            },
            link: function(scope, element, attrs) {
                var rows, cols,
                    loading = true,
                    image = new Image();

                function create() {
                    scope.puzzle = puzzle(rows, cols);

                    if (attrs.api) {
                        scope.api = scope.puzzle;
                    }

                    tile();
                }

                function tile() {
                    if (loading) {
                        return;
                    }

                    var width = 600 / cols,
                        height = 600 / rows;

                    scope.puzzle.traverse(function(tile, row, col) {
                        tile.style = {
                            width: width + 'px',
                            height: height + 'px',
                            'background-size':'100% 100%',
                            'background-image':(tile.empty ? "url(img/01.png)": "url('" + scope.src + "')"),
                            'background-repeat':'no-repeat',
                            'background-color':scope.color
                            //background: (tile.empty ? "url(img/01.jpg) no-repeat -" + (0) + 'px -' + (0) + 'px' : "url('" + scope.src + "') no-repeat -" + (0) + 'px -' + (0) + 'px'),
                            
                        };
                    });

                    scope.puzzle.shuffle();
                }

                attrs.$observe('size', function(size) {
                    size = size.split('x');
                    if (size[0] >= 2 && size[1] >= 2) {
                        rows = size[0];
                        cols = size[1];
                        create();
                    }
                });

                attrs.$observe('src', function(src) {
                    loading = true;
                    image.src = src;
                    image.onload = function() {
                        loading = false;
                        scope.$apply(function() {
                            tile();
                        });
                    };
                });
            }
        };
    });