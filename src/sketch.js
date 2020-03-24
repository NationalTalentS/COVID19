/* eslint-disable max-classes-per-file */
import P5 from 'p5';


import logoImage from './talents_logo.png';
import logoGif from './talents_logo.gif';

let finished = false;
let stopSick = true;
let chart = [];
let roomsFull = false;
let stopMoving = false;
let spliting = stopSick;
let word = [];
let people = 0;
let ccPeople;
// an array to add multiple particles
let particles = [];
let logo;
let logoAnim;
let statCanv;

let cc3;
let cc4;

const colors = {
  green: [27, 176, 109],
  red: [238, 40, 67],
  yellow: [241, 183, 24],
  blue: [24, 74, 156],
  white: [255, 255, 255],
};
const rooms = [];
for (let yyy = 0; yyy < 5; yyy++) {
  // const floors = [];
  for (let xxx = 0; xxx < 5; xxx++) {
    // floors.push({ x: 0 + (10 * xxx), y: 0 + (10 * yyy), busy: false });
    rooms.push({
      x: 10 + (20 * xxx),
      y: 10 + (20 * yyy),
      busy: false
    });
  }
  // rooms.push(floors);
}

const sketch = p5 => {
  // this class describes the properties of a single particle.
  class Particle {
    // setting the co-ordinates, radius and the
    // speed of a particle in both the co-ordinates axes.
    constructor({
      id,
      x,
      y,
      isHealthy,
      isInfected,
      isSick,
      isRecovered,
      room,
      power,
    }) {
      this.id = id;

      if (!this.isInfected) {
        this.x = typeof x !== 'undefined' ? x : p5.random(80, p5.width - 100);
        this.y = typeof y !== 'undefined' ? y : p5.random(80, p5.height - 100);
        this.xSpeed = p5.random(-2, 2);
        this.ySpeed = p5.random(-1, 1.5);
      }
      this.r = 8; // p5.random(1,8);


      this.isHealthy = isHealthy === true;
      this.isInfected = isInfected === true;
      this.isSick = isSick === true;
      this.isRecovered = isRecovered === true;
      this.sickness = 0;
      this.room = typeof room !== 'undefined' ? y : -1;
      this.power = typeof power !== 'undefined' ? power : 100;
    }

    // creation of a particle.
    createParticle() {
      if ((this.isSick) && this.sickness >= 500) {
        if (!stopSick && this.room === -1) {
          this.makeDead();
        } else {
          this.makeHealthy();
        }
      }
      if ((this.isInfected) && this.sickness >= 500) {
        this.sickness = 0;
        this.makeSick();
      }
      if (this.isSick || this.isInfected) {
        this.sickness += Math.round(p5.random(1, 5));
      }
      p5.noStroke();
      if (this.isHealthy) {
        p5.fill('rgba(27, 176, 109,1)');
      } else if (this.isSick) {
        p5.fill('rgba(238, 40, 67, 1)');
      } else if (this.isInfected) {
        p5.fill('rgba(241, 183, 24, 1)');
      } else if (this.isRecovered) {
        p5.fill('rgba(24, 74, 156, 1)');
      } else if (this.isDead) {
        p5.fill('rgba(255, 255, 255, .8)');
      }

      p5.circle(this.x, this.y, this.r);
      // logoAnim.setFrame(100);
      // logoAnim.pause();
      // p5.image(logo, this.x, this.y, 10, 10);
      // p5.text('🦠', this.x, this.y);

      if (this.isInfected || this.isSick) {
        p5.textSize(10);
        p5.text(this.sickness, this.x, this.y);
        p5.fill(255, 255, 255);
      }
    }

    makeInfected() {
      if (this.isHealthy !== true) return;
      // noStroke();
      // fill('rgba(255,0,0,1)');
      // circle(this.x,this.y,8);
      this.isInfected = true;
      this.isSick = false;
      this.isHealthy = false;
      this.isRecovered = false;
    }

    makeSick() {
      if (this.isHealthy !== true && this.isInfected !== true) return;
      // noStroke();
      // fill('rgba(255,0,0,1)');
      // circle(this.x,this.y,8);
      this.isInfected = true;
      this.isSick = true;
      this.isHealthy = false;
      this.isRecovered = false;
    }

    makeDead() {
      this.isInfected = false;
      this.isHealthy = false;
      this.isSick = false;
      this.isRecovered = false;
      this.isDead = true;
    }

    makeHealthy() {
      // if ( ! this.isSick ) return;
      // noStroke();
      // fill('rgba(255,255,255,1)');
      // circle(this.x,this.y,this.r);
      this.isInfected = false;
      this.isHealthy = false;
      this.isSick = false;
      this.isRecovered = true;
      this.sickness = 0;
      this.xSpeed = p5.random(-2, 2);
      this.ySpeed = p5.random(-3, 3.5);
      this.x = p5.random(80, p5.width - 100);
      this.y = p5.random(80, p5.height - 100);
      if (this.room !== -1) {
        if (rooms[this.room]) {
          rooms[this.room].busy = false;
        }
      }
    }

    // setting the particle in motion.
    moveParticle() {
      if (this.isDead) return;
      if ( stopMoving && ( !this.isSick ) ) return;

      if (this.x < 80 || this.x > p5.width - 100) this.xSpeed *= -1;
      if (this.y < 80 || this.y > p5.height - 100) this.ySpeed *= -1;

      if (finished || this.isSick || (stopSick && (this.isInfected))) {
        if (this.room === -1) {
          const freeRoom = rooms.findIndex(r => r.busy === false);
          if (freeRoom !== -1) {
            rooms[freeRoom].busy = true;
            // this.x = (width - 100 ) - rooms[freeRoom].x; //width - 50;
            // this.y = p5.height - rooms[freeRoom].y - 100; //height - 50;
            this.x = (p5.width - 100) + rooms[freeRoom].x; // width - 50;
            this.y = (p5.height - 100) + rooms[freeRoom].y; // height - 50;
            this.room = freeRoom;
            this.xSpeed = 0;
            this.ySpeed = 0;
            roomsFull = false;
            // console.log(this.x, this.y);
          } else {
            roomsFull = true;
            // this.power--;
            // this.sickness++;
            this.xSpeed = 0;
            this.ySpeed = 0;
            // alert('No more rooms :(');
          }
        }

        // if (this.id === 1) {
        // this.x = p5.width - 100 - rooms[this.id].x ;//width - 50;
        // this.y = p5.height - 100 - rooms[this.id].y ;//height - 50;
      }

      // } else {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
      // }
    }

    // this function creates the connections(lines)
    // between particles which are less than a certain distance apart

    joinParticles(_paraticles) {
      _paraticles.forEach(element => {
        const dis = p5.dist(this.x, this.y, element.x, element.y);

        if (dis < 50) {
          if ((this.isSick || (this.isInfected && this.sickness > p5.random(50, 100))) && element.isHealthy) {
            element.makeInfected();
            if (this.isInfected) {
              p5.stroke('rgba(255,255,0,1)');
            } else {
              p5.stroke('rgba(255,0,0,1)');
            }
            p5.line(this.x, this.y, element.x, element.y);
          }
          if ((element.isSick || (element.isInfected && element.sickness > p5.random(50, 100))) && this.isHealthy) {
            this.makeInfected();
            if (element.isInfected) {
              p5.stroke('rgba(255,255,0,1)');
            } else {
              p5.stroke('rgba(255,0,0,1)');
            }
            p5.line(this.x, this.y, element.x, element.y);
          }
          // element.makeSick();
          // stroke('rgba(255,255,255,0.04)');
          // line(this.x,this.y,element.x,element.y);
          // console.log(element, dis)
        }
      });
    }
  }


  // Jitter class
  class Jitter {
    constructor(props) {
      const {
        letter,
        x,
        xMax,
        xMin,
        y,
        fill,
        font,
        textSize,
        textStyle,
        id,
      } = props;
      this.props = props;

      this.xMax = xMax;
      this.xMin = xMin;
      this.x = xMin + (20); // ||p5.random(width);
      this.y = y + (10); // ||p5.random(height);
      this.pos = { y: this.y, x: this.x };
      this.speed = p5.random(1.5, 2.5);
      this.color = fill;
      this.font = font;
      this.textSize = textSize;
      this.text = letter;
      this.textStyle = textStyle;
      this.id = id;
    }

    move() {
      this.x += p5.random(-this.speed, this.speed);
      this.y += p5.random(-this.speed, this.speed);
    }

    display({ timeline }) {
      p5.noStroke();
      // console.log(this.font);
      p5.textFont(this.font);
      p5.textSize(this.textSize);
      p5.textStyle(this.textStyle);
      p5.fill(this.color);
      p5.text(this.text, this.x, this.y);
      p5.textStyle(p5.NORMAL);

      if (this.text !== 'T') {
        if (spliting === true) {
          if (this.x <= this.xMax ) {
            this.x += this.speed;
          }
        } else {

          if (this.x >= this.xMax) {
            this.speed *= -1;
          } else if (this.x <= this.xMin ) {
            this.speed *= -1;
          }
          this.x += this.speed;
        }
      } else {
        this.x = this.pos.x;
      }
      // if (timeline) {
      // //   this.pos.x += timeline;
      //   this.x += timeline;
      // }
    }
  }

  function setupLogo() {
    const {
      red,
      green,
      yellow,
      blue
    } = colors;
    const alpha = '0.7';
    word = [];
    word.push(new Jitter({
      id: 1,
      letter: 'T',
      xMax: 0,
      xMin: 0,
      x: spliting ? 0 : 0,
      y: 35,
      font: 'Georgia',
      textSize: 50,
      textStyle: p5.NORMAL,
      fill: (`rgba(${green[0]}, ${green[1]}, ${green[2]}, ${alpha})`)
    }));

    word.push(new Jitter({
      id: 2,
      letter: 'a',
      xMax: 50,
      xMin: 18,
      x: spliting ? 50 : 18,
      y: 53,
      font: 'Georgia',
      textSize: 50,
      textStyle: p5.NORMAL,
      fill: (`rgba(${green[0]}, ${green[1]}, ${green[2]}, ${alpha})`)
    }));

    word.push(new Jitter({
      id: 3,
      letter: 'l',
      xMax: 80,
      xMin: 33,
      x: spliting ? 80 : 33,
      y: 40,
      font: 'Comics',
      textSize: 50,
      textStyle: p5.ITALIC,
      fill: (`rgba(${red[0]}, ${red[1]}, ${red[2]}, ${alpha})`)
    }));

    word.push(new Jitter({
      id: 4,
      letter: 'e',
      xMax: 100,
      xMin: 43,
      x: spliting ? 100 : 43,
      y: 42,
      font: 'Tahoma',
      textSize: 50,
      textStyle: p5.NORMAL,
      fill: (`rgba(${red[0]}, ${red[1]}, ${red[2]}, ${alpha})`)
    }));

    word.push(new Jitter({
      id: 5,
      letter: 'n',
      xMax: 140,
      xMin: 65,
      x: spliting ? 140 : 65,
      y: 53,
      font: 'Tahoma',
      textSize: 34,
      textStyle: p5.NORMAL,
      fill: (`rgba(${yellow[0]}, ${yellow[1]}, ${yellow[2]}, ${alpha})`)
    }));

    word.push(new Jitter({
      id: 6,
      letter: 't',
      xMax: 170,
      xMin: 79,
      x: spliting ? 170 : 79,
      y: 37,
      font: 'Comics',
      textSize: 38,
      textStyle: p5.ITALIC,
      fill: (`rgba(${yellow[0]}, ${yellow[1]}, ${yellow[2]}, ${alpha})`)
    }));


    word.push(new Jitter({
      id: 7,
      letter: 'S',
      xMax: 200,
      xMin: 86,
      x: spliting ? 200 : 86,
      y: 45,
      font: 'Tahoma',
      textSize: 60,
      textStyle: p5.NORMAL,
      fill: (`rgba(${blue[0]}, ${blue[1]}, ${blue[2]}, ${alpha})`)
    }));
  }

  function drawLogo() {
    // p5.image(logo, 10, p5.height - logo.height);
    word.map(w => w.display());
  }

  function doStatus() {
    const healthy = particles.filter(e => (e.isHealthy)).length;
    const sick = particles.filter(e => (e.isSick)).length;
    const infected = particles.filter(e => (e.isInfected)).length;
    const recovered = particles.filter(e => (e.isRecovered)).length;
    const dead = particles.filter(e => (e.isDead)).length;
    const {
      red,
      yellow,
      green,
      blue,
      white
    } = colors;

    const lineH = 60;

    const lines = [];

    lines.push({
      title: 'مريض',
      total: sick,
      y: (statCanv.width / 2),
      x: lineH + (lineH * lines.length),
      fill: `rgba(${red[0]}, ${red[1]}, ${red[2]}, 1)`,
    });

    lines.push({
      title: 'معدي',
      total: infected,
      y: (statCanv.width / 2),
      x: lineH + (lineH * lines.length),
      fill: `rgba(${yellow[0]}, ${yellow[1]}, ${yellow[2]}, 1)`,
    });

    lines.push({
      title: 'متعافي',
      total: recovered,
      y: (statCanv.width / 2),
      x: lineH + (lineH * lines.length),
      fill: `rgba(${blue[0]}, ${blue[1]}, ${blue[2]}, 1)`,
    });

    lines.push({
      title: 'صحيح',
      total: healthy,
      y: (statCanv.width / 2),
      x: lineH + (lineH * lines.length),
      fill: `rgba(${green[0]}, ${green[1]}, ${green[2]}, 1)`,
    });

    lines.push({
      title: 'لم يعالج',
      total: dead,
      y: (statCanv.width / 2),
      x: lineH + (lineH * lines.length),
      fill: `rgba(${white[0]}, ${white[1]}, ${white[2]}, 1)`,
    });

    statCanv.background('#222');
    statCanv.textSize(20);
    statCanv.textAlign(p5.CENTER);

    lines.map(l => {
      statCanv.fill(l.fill);
      statCanv.text(`${l.title}:\n${l.total}`, l.y, l.x);
      return l;
    });


    p5.image(statCanv, p5.width - statCanv.width, 0);
  }


  p5.preload = () => {
    logo = p5.loadImage(logoImage);
    logoAnim = p5.loadImage(logoGif);
  };

  function resetSketch() {
    particles = [];
    chart = [];
    finished = false;
    spliting = stopSick;
    if (typeof cc4 !== 'undefined') {
      cc4.elt.hidden = true;
      cc4.html('');
    }

    // for(let i = 0;i<width/10;i++){
    for (let i = 0; i < rooms.length; i++) {
      rooms[i].busy = false;
    }

    if (ccPeople && ccPeople.elt.value && parseFloat(ccPeople.elt.value)) {
      people = parseFloat(ccPeople.elt.value);
    }

    if (people <= 0 || people >= 1000) {
      people = Math.round(p5.windowWidth / 6);
    }

    console.log({ people, w: p5.windowWidth });


    for (let i = 0; i < people; i++) {
      if (i === 0) {
        particles.push(new Particle({
          id: i,
          x: p5.width - 100 - rooms[0].x + 10,
          y: p5.height - 100 - rooms[0].y + 10,
          isSick: true,
          // room: 0,
        }));
      } else {
        particles.push(new Particle({
          id: i,
          isHealthy: true
        }));
      }
    }

    setupLogo();

    statCanv = p5.createGraphics(95, p5.height - 100);

    p5.loop();
  }

  // p5.windowResized = ()  => {
  //   console.log('resizing....');

  //   p5.resizeCanvas(p5.windowWidth, 300);
  // }

  p5.setup = () => {
    const canvasDiv = document.getElementById('myCanvas');
    const width = canvasDiv.offsetWidth;
    spliting = stopSick;

    //   lifeP.mouseClicked(changeGray);
    // createCanvas(windowWidth, windowHeight - 50);
    console.log('p5.windowWidth', width);
    // console.log(JSON.stringify({...p5}, null, 2));

    // const cnv = p5.createCanvas(p5.windowWidth, 300);
    const cnv = p5.createCanvas(width, 600);
    cnv.parent(p5.select('#myCanvas'));
    // cnv.elt.className ='container';
    // cnv.style('display', 'block');
    console.log(cnv.elt);

    logo.resize(logo.width / 3, logo.height / 3);
    // logoAnim.resize(160, 75);

    // logoAnim

    resetSketch();

    const navbar = p5.createDiv('');
    navbar.parent(canvasDiv);
    // navbar.elt.className = 'bg-dark d-flex xflex-column justify-content-start align-items-center py-2 px-2';
    navbar.elt.className = 'bg-dark d-flex flex-column justify-content-start align-items-center py-2 px-2';

    const col1 = p5.createDiv('');
    col1.parent(navbar);
    // col1.elt.className = 'bg-dark d-flex flex-column justify-content-start align-items-center py-2 px-2';


    ccPeople = p5.createInput(people.toString(), 'number');
    ccPeople.elt.min = 10;
    ccPeople.elt.max = 999;
    ccPeople.elt.className = 'form-control ml-2';
    ccPeople.elt.style.display = 'inline-block';
    ccPeople.elt.style.width = '60px';
    ccPeople.parent(col1);

    const cc2 = p5.createButton('إنحسار');
    cc2.elt.className = 'btn btn-success';
    cc2.parent(col1);
    cc2.mouseClicked(() => {
      stopSick = true;
      // alert('clicked');
      // finshed = false;
      resetSketch();
      // loop();
    });

    const cc = p5.createButton('إنتشار');
    cc.elt.className = 'btn btn-danger mr-3 ml-3';
    cc.parent(col1);
    cc.mouseClicked(() => {
      stopSick = false;
      // alert('clicked');
      // finshed = false;
      resetSketch();
      // loop();
    });

    const stopMovingTime = 5;
    const ccStopMoving = p5.createButton('🤚🏻 حظر تجول');
    ccStopMoving.elt.className = 'btn btn-primary';
    ccStopMoving.parent(col1);
    ccStopMoving.mouseClicked((e) => {
      stopMoving = !stopMoving;
      ccStopMoving.elt.className += ' disabled btn-sm';
      ccStopMoving.elt.disabled = true;
      ccStopMoving.elt.dataset.counting = 0;
      ccStopMoving.html(`ممنوع الحركة ${stopMovingTime - ccStopMoving.elt.dataset.counting}`);
      ccStopMoving.counter = setInterval(() => {
        ccStopMoving.elt.dataset.counting = parseFloat(ccStopMoving.elt.dataset.counting) + 1;
        if (parseFloat(ccStopMoving.elt.dataset.counting) === stopMovingTime) {
          clearInterval(ccStopMoving.counter);
          ccStopMoving.elt.disabled = false;
          stopMoving = !stopMoving;
          ccStopMoving.html('🤚🏻 حظر تجول');
          ccStopMoving.elt.className = 'btn btn-primary';
          return;
        }
        ccStopMoving.html(`ممنوع الحركة ${stopMovingTime - ccStopMoving.elt.dataset.counting}`);
      }, 1000);
      // alert('clicked');
      // finshed = false;
      // resetSketch();
      // loop();
    });

    const col2 = p5.createDiv('');
    col2.elt.className = 'd-flex flex-row justify-content-start align-items-center my-3';
    col2.parent(navbar);

    cc3 = p5.createDiv(`الحالة: ${stopSick ? 'إنحسار' : 'إنتشار'}`);
    cc3.elt.className = 'text-light';
    cc3.parent(col2);


    cc4 = p5.createDiv('');
    cc4.elt.className = 'alert alert-danger m-0 mr-2 p-1';
    // cc4.html('😱لا يوجد غرف');
    cc4.elt.hidden = true;
    cc4.parent(col2);


    // const cc7 = p5.createDiv('');
    // // cc7.elt.className = 'mr-auto ';
    // cc7.elt.className = 'bg-dark d-flex xflex-column justify-content-between align-items-center pb-2 px-2';
    // cc7.parent(canvasDiv);

    // let cc5 = p5.createDiv(`@ahmader  - version ${VERSION}`);
    // cc5.elt.className = 'ml-auto small text-muted';
    // cc5.elt.dir = 'ltr';
    // // cc5.elt.style.fontSize = '8px';
    // cc5.parent(cc7);


    // const t = p5.createSpan('نصيحة من: ');
    // t.parent(cc7);
    // t.elt.className = 'small text-muted ml-1';

    // cc5 = p5.createA('https://talents.sa', 'شركة المواهب الوطنية');
    // cc5.elt.className = 'text-light';
    // cc5.elt.style.fontFamily = 'Tahoma';
    // cc5.elt.dir = 'ltr';
    // cc5.parent(cc7);


    // twitter

    // const divT = p5.createDiv('');
    // divT.elt.className = 'container d-flex flex-column flex-md-row bg-light';


    // const divShare = p5.createDiv('');
    // divShare.elt.className = 'col-12 col-md-4 text-center py-4';
    // divShare.parent(divT);

    // let curA = p5.createA(
    //   'https://twitter.com/intent/tweet?button_hashtag=فهمت_التباعد&ref_src=twsrc%5Etfw',
    //   'Tweet #فهمت_التباعد2'
    // );
    // curA.elt.className = 'twitter-hashtag-button';
    // curA.elt['data-show-count'] = 'true';
    // curA.elt.dataset.showCount = true;
    // curA.elt.dataset.lang = 'ar';
    // curA.elt.dataset.size = 'large';
    // curA.parent(divShare);

    // curA = p5.createDiv('---- أو شارك الصفحة ----');
    // curA.elt.className = 'small my-4';
    // curA.parent(divShare);

    // const curWhatsapp1 = p5.createA('whatsapp://send?text=https://covid19.talents.sa/', 'WhatsApp');
    // curWhatsapp1.elt.className = 'btn btn-sm btn-link';
    // // curWhatsapp.elt.onclick = () => (false);
    // // curWhatsapp.elt['disabled'] = 'disabled';
    // curWhatsapp1.parent(divShare);

    // (p5.createElement('br')).parent(divShare);

    // const curWhatsapp = p5.createA('#', 'others...');
    // curWhatsapp.elt.className = 'btn btn-sm btn-link disabled';
    // curWhatsapp.elt.disabled = true;
    // curWhatsapp.elt.dir = 'ltr';
    // curWhatsapp.elt.onclick = () => (false);
    // curWhatsapp.parent(divShare);

    // const divLogo = p5.createImg(logoGif, '');
    // divLogo.elt.className = 'img-fluid';
    // // const divLogo = logoAnim.createImage(200, 200);
    // divLogo.parent(divShare);

    // const divWall = p5.createDiv('');
    // divWall.elt.className = 'col-12 col-md-8';
    // divWall.parent(divT);

    // const curT = p5.createA(
    //   'https://twitter.com/TalentsCenter/lists/Covid19?ref_src=twsrc%5Etfw',
    //   'Tweets by TalentsCenter'
    // );
    // curT.elt.className = 'twitter-timeline';
    // curT.elt['data-show-count'] = 'true';
    // curT.elt.dataset.showCount = true;
    // curT.elt.dataset.lang = 'ar';
    // curT.parent(divWall);

    // const curPost = p5.createElement('script', '');
    // curPost.elt.async = true;
    // curPost.elt.src = 'https://platform.twitter.com/widgets.js';
    // curPost.elt.charset = 'utf-8';
  };

  p5.draw = () => {
    p5.background('#0f0f0f');
    // p5.image(logo, chart.length + 20, p5.height - logo.height - 3);
    // console.log(logoAnim);
    // logoAnim.setFrame(100);
    // logoAnim.pause();
    // p5.image(logoAnim, 0, -60, 400, 400);

    p5.noStroke();

    const healthy = particles.filter(e => (e.isHealthy)).length;
    const sick = particles.filter(e => (e.isSick)).length;
    const infected = particles.filter(e => (e.isInfected)).length;
    const recovered = particles.filter(e => (e.isRecovered)).length;

    cc3.html(`الحالة: ${stopSick ? 'إنحسار' : 'إنتشار'}`);


    const {
      red,
      green,
      // yellow,
      // blue
    } = colors;

    if (roomsFull) {
      p5.fill(red[0], red[1], red[2]);
      p5.textSize(15);
      p5.text('😱لا يوجد غرف', p5.width - 95, p5.height - 120);
      cc4.elt.hidden = false;
      cc4.html('😱لا يوجد غرف');
    } else {
      cc4.elt.hidden = true;
      cc4.html('');
    }

    const boardW = 100;
    const roomW = 20;

    p5.fill('rgba(255,255,255,0.3)');
    p5.rect(p5.width - boardW, p5.height - boardW, boardW, boardW);
    p5.stroke('rgba(0, 255, 0 , .2)');
    for (let yyy = 0; yyy < 5; yyy++) {
      for (let xxx = 0; xxx < 5; xxx++) {
        p5.rect(p5.width - boardW + (roomW * xxx), p5.height - boardW + (roomW * yyy), roomW, roomW);
      }
    }
    // }

    if (chart.length > 1) {
      const [oldhealthy, oldsick, oldinfected, oldrecovered] = chart[chart.length - 1];
      if (oldsick !== sick || oldinfected !== infected || oldrecovered !== recovered) {
        chart.push([healthy, sick, infected, recovered, roomsFull]);
      }
    } else {
      chart.push([healthy, sick, infected, recovered, roomsFull]);
    }


    const chartX = 548;
    const chartY = 10; // 200;
    const chartH = 50;
    const chartW = chart.length;

    p5.rect(chartY, chartX, chartW, chartH);
    let timeline;
    for (let y = 0; y < chart.length; y++) {
      // const total = chart[y][0] + chart[y][1] + chart[y][2];
      timeline = chartY + y;
      p5.stroke('rgba(255,255,255,1)');

      const total = {
        healthy: chart[y][0] + chart[y][3],
        sick: chart[y][1] + chart[y][2],
        all: chart[y][1] + chart[y][2] + chart[y][0] + chart[y][3],
      };
      const pos1 = Math.round((Math.round((total.healthy / total.all) * 100)));
      // const pos2 = Math.round((total.sick / total.all) * 100);

      if (chart[y][4]) {
        p5.stroke(red[0], red[1], red[2]);
        p5.circle(timeline, ((chartX) + ((pos1 / 100) * chartH)), 5);
      }

      p5.stroke(green[0], green[1], green[2]);
      p5.line(timeline, chartX, timeline, ((chartX) + ((pos1 / 100) * chartH)));

      // stroke('rgba(255, 0, 0 , .4)');
      // line(timeline, chartX + pos1 , timeline, (chartX + pos1) - pos2);
    }

    word.map(w => w.display({ timeline }));

    if (recovered !== 0 && infected === 0 && sick === 0) {
      finished = true;
      // return;
      p5.noLoop();
    }

    for (let i = 0; i < particles.length; i++) {
      // if (i === 1) {
      //   particles[i].makeSick();
      // }
      particles[i].createParticle();
      particles[i].joinParticles(particles.slice(i));
      particles[i].moveParticle();

    }
    doStatus();
    // noLoop();
  };
};

// const p5 = new p5(s);
console.warn('createCanvas');
const canv = new P5(sketch);


export default sketch;
export { canv };
