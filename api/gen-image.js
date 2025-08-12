const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = async (req, res) => {
    const { avatar, username, start, end } = req.query;
    if (!avatar || !username || !start || !end) {
        res.status(400).send('Missing avatar, username, start, or end');
        return;
    }

    const width = 643, height = 127;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // พื้นหลังสีเดียวกับ Discord embed
    ctx.fillStyle = '#2b2d31';
    ctx.fillRect(0, 0, width, height);

    // กรอบโค้งมน
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 16);
    ctx.arcTo(8, 8, 16, 8, 8);
    ctx.lineTo(width - 16, 8);
    ctx.arcTo(width - 8, 8, width - 8, 16, 8);
    ctx.lineTo(width - 8, height - 16);
    ctx.arcTo(width - 8, height - 8, width - 16, height - 8, 8);
    ctx.lineTo(16, height - 8);
    ctx.arcTo(8, height - 8, 8, height - 16, 8);
    ctx.closePath();
    ctx.stroke();

    // avatar circle
    try {
        const avatarImg = await loadImage(avatar);
        ctx.save();
        ctx.beginPath();
        ctx.arc(48, 64, 40, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, 8, 24, 80, 80);
        ctx.restore();
    } catch (e) {
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(48, 64, 40, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    // username
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';
    ctx.fillText(`@${username}`, 110, 32);

    // cash
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#00FF66';
    ctx.fillText(`$${Number(start).toLocaleString()} / $${Number(end).toLocaleString()}`, 110, 72);

    res.setHeader('Content-Type', 'image/png');
    res.end(canvas.toBuffer('image/png'));
};
