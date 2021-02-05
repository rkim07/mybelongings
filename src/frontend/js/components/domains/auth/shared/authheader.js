import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	}
}));

export default function AuthHeader(props) {
	const { title } = props;
	const classes = useStyles();

	return (
		<React.Fragment>
			<Avatar className={classes.avatar}>
				<LockOutlinedIcon />
			</Avatar>
			<Typography component='h1' variant='h5'>
				{ title }
			</Typography>
		</React.Fragment>
	)
}
