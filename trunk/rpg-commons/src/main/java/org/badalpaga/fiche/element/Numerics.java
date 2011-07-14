package org.badalpaga.fiche.element;

import java.util.LinkedList;
import java.util.List;

public class Numerics extends AbstractNumeric {

	private Boolean edit;
	private List<AbstractNumeric> contents;
	
	public Numerics(String nom) {
		super(nom);
		this.edit=false;
		this.contents = new LinkedList<AbstractNumeric>();
	}

	public Numerics(String nom, Boolean edit) {
		super(nom);
		this.edit=edit;
		this.contents = new LinkedList<AbstractNumeric>();
	}
	
	public Boolean isEditable(){
		return this.edit;
	}
	
	public Boolean addContent(AbstractNumeric num){		
		for(AbstractNumeric content : this.contents){
			if(content.getNom().equalsIgnoreCase(num.getNom())){
				return false;
			}
		}
		this.contents.add(num);
		return true;
	}
	
	public List<AbstractNumeric> getContents(){
		return contents;
	}
	
	/**
	 * @param path chemin de l'info rechercher
	 * @return NumericAbstract le numeric ou la liste de numeric correspondant au chemin passé en paramétre
	 * @throws IllegalePath chemin demandé inexistant
	 */
	public AbstractNumeric getContent(String path) throws IllegalePath{	
		String step;
		String next;
		if(path.contains(".")){
			step = path.replaceAll("\\..*", "");
			next = path.substring(step.length()+1);
		}else{
			step = path;
			next = "";
		}

		for(AbstractNumeric num : this.contents){
			if(num.getNom().equalsIgnoreCase(step)){
				if(next.isEmpty()){
					return num;
				}else if(num instanceof Numerics){
					return ((Numerics)num).getContent(next);					
				}else{
					throw new IllegalePath(next);
				}
			}
		}
		return null;
	}
	
}
