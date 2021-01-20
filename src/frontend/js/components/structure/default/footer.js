import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
	footer: {
		marginTop: theme.spacing(8),
		borderTop: `1px solid ${theme.palette.divider}`,
		padding: `${theme.spacing(6)}px 0`,
	}
});

const footers = [
	{
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
	},
];

function Footer(props) {
	const { classes } = props;

	return (
		<footer className={classNames(classes.footer, classes.layout)}>
			<Grid container spacing={2} justify='space-evenly'>
				{footers.map(footer => (
					<Grid item xs key={footer.title}>
						<Typography variant='h6' color='textPrimary' gutterBottom>
							{footer.title}
						</Typography>
						{footer.description.map(item => (
							<Typography key={item} variant='subtitle1' color='textSecondary'>
								{item}
							</Typography>
						))}
					</Grid>
				))}
			</Grid>
		</footer>
	)
}

Footer.propTypes = {
	classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Footer);
