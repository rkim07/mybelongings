import React from 'react';
import * as _ from 'lodash';
import { withContext } from '../../../appcontext';
import { withStyles }  from '@material-ui/core/styles';
import HomeFacts from './homefacts';
import Areas from './areas';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = {
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	cardContent: {
		flexGrow: 1,
	},
};

function View(props) {
	const { classes, property } = props;

	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Card className={ classes.root }>
					<CardHeader
						avatar={
							<Avatar aria-label="property image" src= { property.imagePath } className={ classes.avatar }>
								<br/>
							</Avatar>
						}
						title={
							<Typography variant="h5" component="h5">
								{ _.startCase(property.address.street) } <br/>
								{ _.startCase(property.address.city) }, { property.address.state }, { property.address.zip }
							</Typography>
						}
					/>
					<CardContent/>
				</Card>
			</Grid>
			<HomeFacts property={property}/>
			<Areas areas={property.areas}/>
		</Grid>
	);
}

export default withContext(withStyles(styles)(View));
