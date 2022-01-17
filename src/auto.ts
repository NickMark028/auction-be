import { Request, Response } from 'express';
import db from './utils/db';
import { setInterval } from 'timers';
import nodemailer from 'nodemailer';

export async function auto_mail_bidder() {
  console.log('auto mail');
  const rawquery = `SELECT U.email,B.id,P.name,B.currentPrice FROM biddedproduct B, user U, product P 
  where B.topBidderId = U.id and B.statusCode = 200 and P.id=B.id;`;
  const [rows, fields] = await db.raw(rawquery);

  // res.send(rows);
  let temp: any[] = [];
  let product: any[] = [];
  for (let i = 0; i < rows.length; i++) {
    temp = [...temp, rows[i].email];
    product = [
      ...product,
      { id: rows[i].id, name: rows[i].name, price: rows[i].currentPrice },
    ];
  }
  console.log(temp);
  console.log(product);
  // check mail gửi >>>>> đánh dấu đã gửi >> guiwr vào db để lần sau query
  if (rows.length === 0) {
    console.log('nothing expired!!!');
  } else {
    //gửi mail và đánh dấu
    const transporter = nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '538ef709ea08018d00e775be273dbad0', // generated ethereal user
        pass: '77272a7ae582733d53e54c790d4c9aa3', // generated ethereal password
      },
    });
    //gửi từng bidder
    for (let i = 0; i < temp.length; i++) {
      const info = await transporter.sendMail({
        from: '"Anh Tu - do not reply" <18127243@student.hcmus.edu.vn>', // sender address
        to: temp[i], // list of receivers
        subject: 'Email from auction please do not reply', // Subject line
        text:
          'You win bid the product: ' +
          product[i].name +
          ' at the price :' +
          product[i].price, // plain text body
      });
      //API đánh dấu đã gửi
      const newquery = `update biddedproduct set statusCode = 201 where id=${product[i].id}`;
      await db.raw(newquery);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  }
}
export async function auto_mail_seller_sold() {
  const rawquery = `SELECT U.email,P.id,P.name,B.currentPrice 
  FROM biddedproduct B, user U, product P 
  where  B.statusCode = 201 and P.id=B.id and P.sellerId = U.id and B.auctionLogCount !=0;`;
  const [rows, fields] = await db.raw(rawquery);

  // res.send(rows);
  let temp: any[] = [];
  let product: any[] = [];
  for (let i = 0; i < rows.length; i++) {
    temp = [...temp, rows[i].email];
    product = [
      ...product,
      { id: rows[i].id, name: rows[i].name, price: rows[i].currentPrice },
    ];
  }
  // console.log(temp);
  // console.log(product);
  // check mail gửi >>>>> đánh dấu đã gửi >> guiwr vào db để lần sau query
  if (rows.length === 0) {
    console.log('nothing expired!!!');
  } else {
    //gửi mail và đánh dấu
    const transporter = nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '538ef709ea08018d00e775be273dbad0', // generated ethereal user
        pass: '77272a7ae582733d53e54c790d4c9aa3', // generated ethereal password
      },
    });
    //gửi từng bidder
    for (let i = 0; i < temp.length; i++) {
      const info = await transporter.sendMail({
        from: '"Anh Tu - do not reply" <18127243@student.hcmus.edu.vn>', // sender address
        to: temp[i], // list of receivers
        subject: 'Email from auction please do not reply', // Subject line
        text:
          'The product : ' +
          product[i].name +
          ' was sold at the price :' +
          product[i].price, // plain text body
      });
      //API đánh dấu đã gửi
      const newquery = `update biddedproduct set statusCode = 202 where id=${product[i].id}`;
      await db.raw(newquery);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  }
}

export async function auto_mail_seller_nothing() {
  console.log('auto mail');
  const rawquery = `SELECT U.email,P.name FROM biddedproduct B, user U, product P 
  where  B.statusCode = 200 and P.id=B.id and P.sellerId = U.id;`;
  const [rows, fields] = await db.raw(rawquery);

  // res.send(rows);
  let temp: any[] = [];
  let product: any[] = [];
  for (let i = 0; i < rows.length; i++) {
    temp = [...temp, rows[i].email];
    product = [...product, { id: rows[i].id, name: rows[i].name }];
  }
  console.log(temp);
  console.log(product);
  // check mail gửi >>>>> đánh dấu đã gửi >> guiwr vào db để lần sau query
  if (rows.length === 0) {
    console.log('nothing expired!!!');
  } else {
    //gửi mail và đánh dấu
    const transporter = nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '538ef709ea08018d00e775be273dbad0', // generated ethereal user
        pass: '77272a7ae582733d53e54c790d4c9aa3', // generated ethereal password
      },
    });
    //gửi từng bidder
    for (let i = 0; i < temp.length; i++) {
      const info = await transporter.sendMail({
        from: '"Anh Tu - do not reply" <18127243@student.hcmus.edu.vn>', // sender address
        to: temp[i], // list of receivers
        subject: 'Email from auction please do not reply', // Subject line
        text:
          'Nothing bidder bid: ' +
          product[i].name +
          ' and the time is EXPIRED!!',
      });
      //API đánh dấu đã gửi
      const newquery = `update biddedproduct set statusCode = 202 where id=${product[i].id}`;
      await db.raw(newquery);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  }
}
