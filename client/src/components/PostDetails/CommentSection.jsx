import React, {useState, useRef} from 'react';
import {Typography, TextField, Button} from "@material-ui/core";
import {useDispatch} from "react-redux";

import useStyles from "./styles";
import {commentPost} from '../../actions/posts'

const CommentSection = ({post}) => {
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments)
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'))
    const dispatch = useDispatch();
    const commentsRef = useRef();

    const handleClick = async () => {
        const finalComment = `${user.result.name}: ${comment}`;

        // Gửi bình luận lên server và nhận lại danh sách bình luận mới
        const newComments = await dispatch(commentPost(finalComment, post._id));

        // Cập nhật danh sách bình luận trên UI bằng cách dùng dữ liệu từ server trả về
        setComments(newComments);
        setComment(''); // Xóa nội dung trong ô nhập sau khi gửi bình luận

        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Bình luận</Typography>
                    {comments.map((c, i) => (
                        <Typography key={i} gutterBottom variant="subtitle1">
                            <strong>{c.split(': ')[0]}</strong>
                            {c.split(':')[1]}
                        </Typography>
                    ))}
                    <div ref={commentsRef}/>
                </div>

                {user?.result?.name && (
                    <div style={{width: '70%'}}>
                        <Typography gutterBottom variant="h6">Viết bình luận</Typography>
                        <TextField
                            fullWidth
                            rows={4}
                            variant="outlined"
                            label="Bình luận"
                            multiline
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <Button style={{marginTop: '10px'}} fullWidth disabled={!comment} variant="contained"
                                color="primary" onClick={handleClick}>
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSection