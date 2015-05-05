﻿/// <reference path="plot.ts" />
module Plot {

    function draw(item: Pie) {
        item.baseDraw();

        var total = 0;

        for (var i = 0; i < item.data.length; i++) {
            total += item.data[i].value;
        }

        var x = item.canvas.width / 2;
        var y = item.canvas.height / 2;
        var minLength = Math.min(x, y);

        item.context.arc(x, y, minLength, 0, Math.PI * 2);
        item.context.stroke();

        var tempAngle = 0;

        for (var i = 0; i < item.data.length; i++) {
            var oldAngle = tempAngle;
            var addAngle = item.animateNum * Math.PI * 2 * item.data[i].value / total;
            item.context.beginPath();
            item.context.moveTo(x, y);
            item.context.arc(x, y, minLength, tempAngle, tempAngle = tempAngle + addAngle);
            item.context.fillStyle = item.data[i].colour;
            item.context.fill();

            item.context.beginPath();
            item.context.fillStyle = "black";
            item.context.font = (Math.min(minLength, minLength / 2 * addAngle) / ( item.data[i].key.length )) + "px Arial";
            item.context.textBaseline = "middle";
            item.context.textAlign = "center";

            item.context.fillText(item.data[i].key, x + 2 * minLength / 3 * Math.cos(oldAngle + addAngle / 2), y + 2 * minLength / 3 * Math.sin(oldAngle + addAngle / 2), minLength);
        }
    }

    var defaultOptions = {


    }

    export class Pie extends BasePlot implements Ianimateable {

        data: KVCDatum[];

        animate: () => void;

        animateNum: number;

        constructor(id: string, data: any, options?: Object) {
            this.data = [];

            this.animateNum = 0;

            if (options == null || options == undefined) {
                options = defaultOptions;
            }

            var tempOptions = options;
            for (var prop in defaultOptions) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = defaultOptions[prop];
                }
            }        

            for (var prop in data) {
                this.data.push(new KVCDatum(prop, data[prop]));
            }

            super(id, options, draw);

            var me = this;

            //this.draw(me);

            this.animate = function () {
                me.animateNum = 0;

                function animationFrame() {
                    me.animateNum += 0.05;
                    if (me.animateNum >= 1) {
                        me.animateNum = 1;
                        me.draw(me);
                        return;
                    }
                        me.draw(me);
                        window.requestAnimationFrame(animationFrame);
                }

                animationFrame();

            }

            this.animate();
        }

    }

} 