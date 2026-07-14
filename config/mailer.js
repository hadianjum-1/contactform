import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,

    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
});

transporter.verify((err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("SMTP Connected");
    }
});