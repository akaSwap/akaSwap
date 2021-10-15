import React from 'react'
// import { useContext } from 'react';
// import { AkaSwapContext } from '../../context/AkaSwapContext'
// import ReactDOM from 'react-dom';
// import Sketch from 'react-p5';
// import { createP5Sketch } from "react-generative-tools";
import P5Wrapper from 'react-p5-wrapper';
import { Vector } from "p5";
// import darkMask from './imgs/mask_pt3-01.svg'
// import lightMask from './imgs/mask_pt3-02.svg'

import styles from './styles.module.scss'

// import base from 'base-x'
// const alphabet58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
// const base58 = base(alphabet58)
// const s = 64

export const Identicon = ({ address = '', logo }) => {

  // akaSwap method
  // const context = useContext(AkaSwapContext)

  if (logo) {
    return (
      <div className={styles.identicon}>
        <img
          src={`https://services.tzkt.io/v1/avatars2/${address}`}
          alt="identicon"
        />
      </div>
    )
  }
  // const decoded = base58.decode(address)
  // const hex = decoded.toString('hex')
  // const seed = parseInt(hex, 16) % 987654321
  const seed = hashCode(address)


  function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0)
  }



  function sketch(p5) {

    let cellsize = 12;
    let gridsize = 12;
    let size = 0;
    let wh = 150;

    let count = 1;
    let ptns;
    let bg;
    let shapeIdx, shapeX, shapeY, shapeS, shapeR, shapeC;

    p5.init = function () {
      p5.randomSeed(seed);
      ptns = [];
      size = gridsize * cellsize;

      p5.noFill();
      bg = p5.random(100, 150);
      shapeIdx = p5.int(p5.random(3));
      shapeX = p5.random(50, 100);
      shapeY = p5.random(50, 100);
      shapeS = p5.random(50, 100);
      shapeR = p5.int(p5.random(5));
      shapeC = p5.random(360);
      p5.strokeCap(p5.PROJECT);
      // strokeCap( ROUND);

      p5.frameRate(15);

      for (let y = 0; y < count; y++) {
        for (let x = 0; x < count; x++) {
          for (let i = 0; i < 4; i++) {
            ptns.push(new Ptn(x * size, y * size, p5));
          }
        }
      }
    };
    p5.preload = function () {
      p5.randomSeed(seed);
    }
    p5.setup = function () {
      p5.createCanvas(wh, wh);
      p5.pixelDensity(1);
      p5.background(40, 5);
      p5.colorMode(p5.HSB, 360, 100, 100, 100);
      p5.init();
      // }
    };
    p5.draw = function () {
      p5.rectMode(p5.CORNER);
      p5.noStroke();
      p5.fill(100, bg, 0, 255);
      p5.rect(0, 0, p5.width, p5.height);

      if (shapeIdx === 0) {
        p5.fill(shapeC, 80, 50, 255);
        p5.ellipse(shapeX, shapeY, shapeS, shapeS);
      } else if (shapeIdx === 1) {
        p5.fill(shapeC, 80, 50, 255);
        p5.rectMode(p5.CENTER);
        p5.push();
        p5.translate(shapeX, shapeY);
        p5.rotate(p5.radians(shapeR * 45));
        p5.rect(0, 0, shapeS, shapeS);
        p5.pop();
      }
      p5.rectMode(p5.CORNER);

      if (p5.frameCount % 30 === 0) {
        p5.init();
      } else if (p5.frameCount % 30 > 1 && ptns != null) {
        for (let i = 0; i < ptns.length; i++) {
          ptns[i].update();
          ptns[i].draw();
          // if (ptns[i].dead) ptns[i] = new Ptn(ptns[i].x, ptns[i].y);
        }
      }
    };
    class Ptn {
      constructor(x, y, p5) {
        this.p5 = p5
        this.dead = false;
        this.x = x;
        this.y = y;
        this.angle = p5.random(0.1, 0.9);
        this.ww = p5.random(1, 5);
        this.aa = p5.int(p5.random(3, 8));
        this.segCount = p5.random(2, 12);
        this.segs = [];
        this.gray = p5.int(p5.random(1, 10));
        this.ro = p5.random(0.3, 0.7);
        this.ss = 5 * p5.int(p5.random(1, 3));
        this.type = p5.int(p5.random(4));
        // this.type = p5.int(1);
        this.type2 = p5.int(p5.random(2));
        // this.type2 = p5.int(0);
        // this.type = 2;
        // this.dir = Vector(Math.cos(p5.TWO_PI / this.aa), Math.sin(p5.TWO_PI / this.aa), 0).mult(30);
        this.dir = Vector.fromAngle(p5.TWO_PI / this.aa).mult(30);

        this.pos = p5.createVector(
          Math.ceil(p5.random(50, 100)),
          Math.ceil(p5.random(50, 100))
        );

        this.newPos = p5.createVector(0, 0);

        this.segs.push(this.pos);
        this.c = p5.color(p5.random(360), p5.random(10, 70), 100);
        // this.c = color(random(360), 0, this.gray*10);
      }

      update() {
        if (this.p5.random() < this.angle) {
          this.dir.rotate(this.p5.random() < this.ro ? -this.p5.PI / 2 : this.p5.PI / 2);
        }

        //move
        // this.newPos = Vector.add(this.pos, this.dir);
        this.newPos = p5.createVector(
          this.pos.x + this.dir.x,
          this.pos.y + this.dir.y,
        );

        this.segs.unshift(this.newPos);
        this.pos = this.newPos;

        if (this.segs.length > this.segCount) this.segs.pop();
      }

      draw() {
        this.p5.stroke(this.c);
        this.dead = true;
        this.p5.strokeWeight(this.ww);

        for (let i = 0; i < this.segs.length - 1; i++) {
          let s = this.segs[i];
          let e = this.segs[i + 1];

          if (s.x >= 0 && s.x <= size && s.y >= 0 && s.y <= size) {
            if (e.x >= 0 && e.x <= size && e.y >= 0 && e.y <= size) {
              this.p5.line(s.x + this.x, s.y + this.y, e.x + this.x, e.y + this.y);
              this.p5.line(s.y + this.x, s.x + this.y, e.y + this.x, e.x + this.y);

              if (this.type2 === 0) {
                this.p5.line(
                  size - s.x + this.x,
                  s.y + this.y,
                  size - e.x + this.x,
                  e.y + this.y
                );
                this.p5.line(
                  size - s.y + this.x,
                  s.x + this.y,
                  size - e.y + this.x,
                  e.x + this.y
                );
              }

              if (this.type === 0) {
                this.p5.strokeWeight(1);
                this.p5.ellipse(size - s.x + this.x, size - s.y + this.y, this.ss, this.ss);
                // ellipse(size - s.y + this.x, size - s.x + this.y, this.ss, this.ss);
              } else if (this.type === 1) {
                this.p5.strokeWeight(0.5);
                this.p5.rectMode(this.p5.CENTER);
                // rect(size - s.x + this.x, size - s.y + this.y, this.ss, this.ss);
                this.p5.push();
                this.p5.rotate(this.p5.radians(45));
                this.p5.rect(size - s.y + this.x, size - s.x + this.y, this.ss, this.ss);
                this.p5.pop();
              } else if (this.type === 2) {
                this.p5.strokeWeight(1);
                this.p5.push();
                this.p5.translate(size - s.x + this.x, size - s.y + this.y);
                this.p5.rotate(this.p5.radians(0));
                this.p5.triangle(0, 0, this.ss, 0, 0, this.ss);
                this.p5.pop();

                this.p5.push();
                this.p5.translate(size - s.y + this.x, size - s.x + this.y);
                this.p5.rotate(this.p5.radians(90));
                this.p5.triangle(0, 0, this.ss, 0, 0, this.ss);
                this.p5.pop();
              }

              this.dead = false;
            }
          }
        }
      }
    }
  }
  // const Shapes = createP5Sketch(sketch);
  return (
    <>
      <div className={styles.wrapper}>
        {/* <Sketch setup={setup} draw={draw} preload={preload} /> */}
        {/* <Shapes id="Shapes"/> */}
        <P5Wrapper sketch={sketch} />
        <div className={styles.mask}></div>
      </div>

    </>
  );
}
