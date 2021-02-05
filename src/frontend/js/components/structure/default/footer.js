import React from 'react';
import classNames from 'classnames';
import Copyright from './copyright';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	footer: {
		borderTop: `1px solid ${theme.palette.divider}`,
		marginTop: theme.spacing(8),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		[theme.breakpoints.up('sm')]: {
			paddingTop: theme.spacing(6),
			paddingBottom: theme.spacing(6),
		}
	}
}));

const links = [
	/*{
		title: 'Company',
		description: ['Team', 'History', 'Contact us', 'Locations'],
	},
	{
		title: 'Features',
		description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
	},
	{
		title: 'Resources',
		description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
	},
	{
		title: 'Legal',
		description: ['Privacy policy', 'Terms of use'],
	}*/
];

export default function Footer() {
	const classes = useStyles();

	return (
		<Container maxWidth='md' component='footer' className={classes.footer}>
			<Grid container spacing={2} justify='space-evenly'>
				{ links.map(link => (
					<Grid item xs key={link.title}>
						<Typography variant='h6' color='textPrimary' gutterBottom>
							{ link.title }
						</Typography>
						{ link.description.map(item => (
							<Typography key={item} variant='subtitle1' color='textSecondary'>
								{ item }
							</Typography>
						))}
					</Grid>
				))}
			</Grid>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	)
}
