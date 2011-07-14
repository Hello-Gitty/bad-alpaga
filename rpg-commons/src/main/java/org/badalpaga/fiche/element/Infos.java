package org.badalpaga.fiche.element;

import java.util.LinkedList;
import java.util.List;

/**
 * Classe qui gere un liste de d'Information textuelle
 * @author cdejean
 *
 */
public class Infos extends AbstractInfo{

	private Boolean edit;
	private List<AbstractInfo> contents;
	
	public Infos(String nom){
		super(nom);
		this.edit = false;
		this.contents = new LinkedList<AbstractInfo>();
	}
	
	public Infos(String nom, Boolean edit){
		super(nom);
		this.edit = edit;
		this.contents = new LinkedList<AbstractInfo>();
	}
	
	public Boolean isEditable(){
		return this.edit;
	}
	
	public Boolean addContent(AbstractInfo info){		
		for(AbstractInfo content : this.contents){
			if(content.getNom().equalsIgnoreCase(info.getNom())){
				return false;
			}
		}
		this.contents.add(info);
		return true;
	}
	
	public List<AbstractInfo> getContents(){
		return contents;
	}
	
	/**
	 * @param path chemin de l'info rechercher
	 * @return InfoAbstract l'Info ou la liste D'info correspondant au chemin passé en paramétre
	 * @throws IllegalePath chemin demandé inexistant
	 */
	public AbstractInfo getContent(String path) throws IllegalePath{	
		
		String step;
		String next;
		if(path.contains(".")){
			step = path.replaceAll("\\..*", "");
			next = path.substring(step.length()+1);
		}else{
			step = path;
			next = "";
		}
		
		for(AbstractInfo info : this.contents){
			if(info.getNom().equalsIgnoreCase(step)){
				if(next.isEmpty()){
					return info;
				}else if(info instanceof Infos){
					return ((Infos)info).getContent(next);					
				}else{
					throw new IllegalePath(next);
				}
			}
		}
		return null;
	}
}
