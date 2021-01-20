import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';

const styles = theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
});

class Add extends React.Component
{
	/**
	 * Constructor
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);

		this.state = {
			mode: 'add',
			property: {}
		}

		this.onHandleClick = this.onHandleClick.bind(this);
	}

	/**
	 * After component is mounted
	 */
	componentDidMount() {
		this.props.getApiMfrs();
	}

	onMfgHandleChange = (property) => {
		this.setState({
			property: property
		})
	}
	/**
	 * Render
	 *
	 * @returns {*}
	 */
	render() {
		const { classes, manufacturers } = this.props;

		return (
			<Grid container spacing={4}>
				<Grid item xs={12}>

				</Grid>
			</Grid>
		)
	}
}

Add.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(Add));
