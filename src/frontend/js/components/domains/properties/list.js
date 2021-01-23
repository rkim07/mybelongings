import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Image from "material-ui-image";
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';

const styles = {
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	cardContent: {
		flexGrow: 1,
	}
};

function List(props) {
	const { classes, properties } = props;

	function handleClick(property) {
		props.onHandleClick(property, 'view');
	}

	return (
		<Grid container spacing={4}>
			{ properties &&
				properties.map((property) => (
					<Grid item key={ property.key } xs={ 12 } sm={ 6 } md={ 4 }>
						<Card className={ classes.card }>
							<CardContent className={ classes.cardContent }>
								<Image src={ property.image_path } />
								<Typography gutterBottom variant="h5" component="h4">
									{ _.startCase(property.address.street) } <br/>
									{ _.startCase(property.address.city) }, { property.address.state }, { property.address.zip }
								</Typography>
							</CardContent>
							<CardActions>
								<Button size="small" color="primary" onClick={ () => handleClick(property) }>
									View
								</Button>
								<Button size="small" color="primary">
									Edit
								</Button>
							</CardActions>
						</Card>
					</Grid>
				))
			}
		</Grid>
	);
}

List.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(List));
