let express=require("express");

let ffmpeg=require("fluent-ffmpeg");

let fileUpload=require("express-fileupload");

let app=express();

//configure middleware

//configure fileupload middleware
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

//configuring the ffmpeg library

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

app.post('/mp4toavi',(req,res)=>{
    res.contentType('video/avi');
    res.attachment('output.avi');

    //uploaded file
    req.files.mp4.mv("tmp/"+req.files.mp4.name,function(err){
        if(err) 
            return res.sendStatus(500).send(err);
        console.log("file uploaded successfully");
    });
    //converting mp4 to avi
    ffmpeg('tmp/'+req.files.mp4.name)
        .toFormat('mp3')
        .on('end',function(){
            console.log("done");
        })
        .on('error',function(error){
            console.log("an error occured"+error.message);
        })
        .pipe(res,{end:true})

});

app.listen(2000,()=>{
    console.log("server started");
});
