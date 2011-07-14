package org.badalpaga.fiche.element;

public class NumericsVal extends Numerics {

	private Integer valeur;
	private Boolean jauge;
	private Integer max;	
	
	public NumericsVal(String nom) {
		super(nom);
		jauge = false;
	}
	
	public NumericsVal(String nom, Boolean edit) {
		super(nom, edit);
		jauge = false;
	}
	
	public NumericsVal(String nom, Boolean edit, Boolean jauge) {
		super(nom, edit);
		this.jauge = jauge;
	}

	public Integer getValeur() {
		return valeur;
	}

	public Boolean isJauge() {
		return jauge;
	}

	public Integer getMax() {
		return max;
	}

	public void setValeur(Integer valeur) {
		if(jauge && valeur > max){
			this.valeur = max;
		}else{
			this.valeur = valeur;
		}
	}

	public void setMax(Integer max) {
		if(jauge){
			this.max = max;
			if(max < valeur){
				valeur = max;
			}
		}
	}
	
}
